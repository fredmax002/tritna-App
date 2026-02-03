#!/usr/bin/env python3
"""
TRITNA Backend API Testing Suite
Tests all backend endpoints for the TRITNA super-app
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://quick-app-deploy-2.preview.emergentagent.com"

class TritnaAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.user_id = None
        self.otp = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test 1: Health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, "API is healthy", data)
                    return True
                else:
                    self.log_test("Health Check", False, "API returned unhealthy status", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_send_otp(self):
        """Test 2: Send OTP endpoint"""
        try:
            payload = {"phone": "771234567"}
            response = self.session.post(
                f"{self.base_url}/api/auth/send-otp", 
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("otp"):
                    self.otp = data["otp"]  # Store OTP for next test
                    self.log_test("Send OTP", True, f"OTP sent successfully: {self.otp}", data)
                    return True
                else:
                    self.log_test("Send OTP", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Send OTP", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Send OTP", False, f"Request error: {str(e)}")
            return False
    
    def test_verify_otp_and_register(self):
        """Test 3: Verify OTP and register user"""
        if not self.otp:
            self.log_test("Verify OTP", False, "No OTP available from previous test")
            return False
            
        try:
            payload = {
                "phone": "771234567",
                "otp": self.otp,
                "first_name": "John",
                "last_name": "Doe"
            }
            response = self.session.post(
                f"{self.base_url}/api/auth/verify-otp",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("user"):
                    self.user_id = data["user"]["id"]  # Store user ID for subsequent tests
                    self.log_test("Verify OTP & Register", True, f"User registered successfully, ID: {self.user_id}", data)
                    return True
                else:
                    self.log_test("Verify OTP & Register", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Verify OTP & Register", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Verify OTP & Register", False, f"Request error: {str(e)}")
            return False
    
    def test_get_wallet(self):
        """Test 4: Get wallet endpoint"""
        if not self.user_id:
            self.log_test("Get Wallet", False, "No user ID available from previous test")
            return False
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/wallet/{self.user_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "balance" in data:
                    self.log_test("Get Wallet", True, f"Wallet retrieved, balance: SLE {data['balance']:,.0f}", data)
                    return True
                else:
                    self.log_test("Get Wallet", False, "Invalid wallet response format", data)
                    return False
            else:
                self.log_test("Get Wallet", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Wallet", False, f"Request error: {str(e)}")
            return False
    
    def test_add_money(self):
        """Test 5: Add money to wallet"""
        if not self.user_id:
            self.log_test("Add Money", False, "No user ID available from previous test")
            return False
            
        try:
            payload = {
                "amount": 100000,
                "payment_method": "afrimoney"
            }
            response = self.session.post(
                f"{self.base_url}/api/wallet/{self.user_id}/add-money",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "new_balance" in data:
                    self.log_test("Add Money", True, f"Money added successfully, new balance: SLE {data['new_balance']:,.0f}", data)
                    return True
                else:
                    self.log_test("Add Money", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Add Money", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Add Money", False, f"Request error: {str(e)}")
            return False
    
    def test_get_restaurants(self):
        """Test 6: Get restaurants endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/food/restaurants", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Get Restaurants", True, f"Retrieved {len(data)} restaurants", f"First restaurant: {data[0].get('name', 'Unknown')}")
                    return True
                else:
                    self.log_test("Get Restaurants", False, "No restaurants found or invalid format", data)
                    return False
            else:
                self.log_test("Get Restaurants", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Restaurants", False, f"Request error: {str(e)}")
            return False
    
    def test_get_events(self):
        """Test 7: Get events endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/enjoyment/events", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Get Events", True, f"Retrieved {len(data)} events", f"First event: {data[0].get('title', 'Unknown')}")
                    return True
                else:
                    self.log_test("Get Events", False, "No events found or invalid format", data)
                    return False
            else:
                self.log_test("Get Events", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Events", False, f"Request error: {str(e)}")
            return False
    
    def test_get_properties(self):
        """Test 8: Get properties endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/os/properties", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Get Properties", True, f"Retrieved {len(data)} properties", f"First property: {data[0].get('title', 'Unknown')}")
                    return True
                else:
                    self.log_test("Get Properties", False, "No properties found or invalid format", data)
                    return False
            else:
                self.log_test("Get Properties", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Properties", False, f"Request error: {str(e)}")
            return False
    
    def test_get_products(self):
        """Test 9: Get products endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/makit/products", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Get Products", True, f"Retrieved {len(data)} products", f"First product: {data[0].get('name', 'Unknown')}")
                    return True
                else:
                    self.log_test("Get Products", False, "No products found or invalid format", data)
                    return False
            else:
                self.log_test("Get Products", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Products", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting TRITNA Backend API Tests")
        print(f"📡 Backend URL: {self.base_url}")
        print("=" * 60)
        
        tests = [
            self.test_health_check,
            self.test_send_otp,
            self.test_verify_otp_and_register,
            self.test_get_wallet,
            self.test_add_money,
            self.test_get_restaurants,
            self.test_get_events,
            self.test_get_properties,
            self.test_get_products
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL: {test.__name__} - Unexpected error: {str(e)}")
                failed += 1
            print()  # Add spacing between tests
        
        print("=" * 60)
        print(f"📊 Test Summary:")
        print(f"   ✅ Passed: {passed}")
        print(f"   ❌ Failed: {failed}")
        print(f"   📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        return passed, failed, self.test_results

def main():
    """Main test execution"""
    tester = TritnaAPITester()
    passed, failed, results = tester.run_all_tests()
    
    # Save detailed results to file
    with open('/app/test_results_detailed.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/test_results_detailed.json")
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()