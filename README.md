# 1. সব প্রোডাক্ট (ডিফল্ট) All Product (Default)
http://localhost:5001/api/products

# 2. শুধু একটা ক্যাটাগরি Only One Category
http://localhost:5001/api/products?category=Men

# 3. একাধিক ক্যাটাগরি Multiple Category
http://localhost:5001/api/products?category=Men,Women

# 4. ব্র্যান্ড ফিল্টার Brand Filter
http://localhost:5001/api/products?brand=Boss

# 5. একাধিক ব্র্যান্ড Multiple Brand
http://localhost:5001/api/products?brand=Nike,Adidas,Boss

# 6. সাইজ ফিল্টার Size Filter
http://localhost:5001/api/products?size=M,L

# 7. কালার ফিল্টার (একটা বা একাধিক) — # দিবে না! Color Filter expect #
http://localhost:5001/api/products?color=2f4f4f
http://localhost:5001/api/products?color=2f4f4f,000000
http://localhost:5001/api/products?color=8b4513,a0522d

# 8. প্রাইস রেঞ্জ Price Range
http://localhost:5001/api/products?minPrice=2000&maxPrice=10000

# 9. সার্চ (নাম/ব্র্যান্ড/ডেসক্রিপশন) Search (Name/Brand/Descriotion)
http://localhost:5001/api/products?q=blazer
http://localhost:5001/api/products?q=boss

# 10. সর্ট: Price Low to High - Sorting
http://localhost:5001/api/products?sort=price_asc

# 11. সর্ট: Price High to Low - Sorting
http://localhost:5001/api/products?sort=price_desc

# 12. পেজিনেশন Pagination
http://localhost:5001/api/products?page=2&limit=10

# 13. সব একসাথে (আসল টেস্ট )  All Filterign (Main Test)
http://localhost:5001/api/products?category=Men&brand=Boss&size=L,XL&color=2f4f4f,000000&minPrice=5000&maxPrice=15000&sort=price_desc&page=1&limit=20

# 14. আরেকটা রিয়েল লাইফ টেস্ট (Another Real Life Test)
http://localhost:5001/api/products?color=8b4513&sort=price_asc
→ শুধু Brown Leather Wallet আসবে (তোমার ডাটাবেসে আছে)

# 15. মাল্টিপল কালার + ক্যাটাগরি (Multiple Color + Category)
http://localhost:5001/api/products?category=Accessories&color=8b4513,a0522d