# ⚡ دليل البدء السريع - كلاشي PWA

## 🚀 خطوات سريعة (5 دقائق)

### 1. إنشاء مستودع GitHub
```bash
1. اذهب إلى github.com
2. انقر "New repository" 
3. اسم المستودع: clashy-app
4. اجعله Public ✅
5. انقر "Create repository"
```

### 2. رفع الملفات
قم بسحب وإفلات هذه الملفات إلى GitHub:

📁 **الملفات الأساسية:**
- ✅ `index.html` - التطبيق الرئيسي
- ✅ `manifest.json` - إعدادات PWA  
- ✅ `sw.js` - Service Worker
- ✅ `README.md` - التوثيق
- ✅ `LICENSE` - الرخصة

📁 **ملفات إضافية (اختيارية):**
- `alhajami.html` - متجر الحجامي
- `Al Ghadeer Office.html` - مكتب الغدير
- `package.json` - معلومات المشروع
- `validate.js` - فحص الملفات

📁 **مجلد GitHub Actions:**
```
.github/
└── workflows/
    └── deploy.yml
```

### 3. تفعيل GitHub Pages
```bash
1. اذهب إلى Settings في المستودع
2. انقر Pages ← Deploy from branch
3. اختر Branch: main ← Folder: / (root)
4. انقر Save
5. انتظر 2-5 دقائق ✨
```

### 4. الرابط النهائي
```
https://your-username.github.io/clashy-app/
```

## 🔧 إعداد قاعدة البيانات (اختياري)

### Supabase سريع:
```bash
1. اذهب إلى supabase.com
2. إنشاء حساب + مشروع جديد
3. انسخ URL و API Key
4. عدل في index.html:
   const SUPABASE_URL = 'your-url';
   const SUPABASE_ANON_KEY = 'your-key';
```

### SQL سريع:
```sql
-- انسخ والصق في Supabase SQL Editor
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  images TEXT[],
  category TEXT DEFAULT 'textiles',
  created_at TIMESTAMP DEFAULT NOW()
);

-- نفس الجدول للمتاجر الأخرى
CREATE TABLE ghadeer_products (LIKE products INCLUDING ALL);
CREATE TABLE stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  icon TEXT DEFAULT 'fas fa-store',
  color TEXT DEFAULT 'primary',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📱 اختبار PWA

### على الهاتف:
```bash
Android (Chrome):
1. افتح الرابط
2. قائمة ← "Add to Home screen"

iPhone (Safari):
1. افتح الرابط  
2. مشاركة ← "Add to Home Screen"
```

### على سطح المكتب:
```bash
Chrome/Edge:
1. افتح الرابط
2. ابحث عن أيقونة + في العنوان
3. انقر "Install"
```

## ✅ قائمة التحقق

### ملفات أساسية:
- [ ] `index.html` موجود
- [ ] `manifest.json` موجود  
- [ ] `sw.js` موجود
- [ ] GitHub Pages مفعل
- [ ] الرابط يعمل

### PWA تعمل:
- [ ] يظهر خيار التثبيت
- [ ] يعمل بدون إنترنت
- [ ] تظهر الأيقونة صحيحة
- [ ] يعمل على الهاتف

### قاعدة البيانات:
- [ ] Supabase متصل
- [ ] الجداول موجودة
- [ ] البيانات تظهر

## 🐛 حل المشاكل السريع

### لا يعمل التثبيت:
```bash
✅ تأكد من HTTPS (GitHub Pages يوفره تلقائياً)
✅ تأكد من وجود manifest.json
✅ تأكد من وجود sw.js
✅ جرب من متصفح مختلف
```

### لا تظهر البيانات:
```bash
✅ افحص console للأخطاء (F12)
✅ تأكد من Supabase URL و Key
✅ تأكد من وجود الجداول
✅ جرب البيانات التجريبية
```

### مشاكل GitHub Pages:
```bash
✅ تأكد من أن المستودع Public
✅ تأكد من وجود index.html في الجذر
✅ انتظر 5-10 دقائق للنشر
✅ جرب رابط مختلف
```

## 🎯 النتيجة المتوقعة

بعد اتباع هذه الخطوات ستحصل على:

✨ **تطبيق ويب تقدمي (PWA)**
✨ **قابل للتثبيت على الهواتف**  
✨ **يعمل بدون إنترنت**
✨ **رابط مباشر للمشاركة**
✨ **تحديثات تلقائية**

## 📞 مساعدة سريعة

إذا واجهت مشاكل:

🔥 **مشاكل عاجلة:** واتساب 07813798636
📧 **أسئلة عامة:** info@clashy.iq  
🐛 **تقرير أخطاء:** GitHub Issues
📖 **دليل مفصل:** اقرأ DEPLOYMENT.md

---

## 🎉 مبروك!

**كلاشي PWA جاهز للاستخدام في أقل من 5 دقائق!** 

شارك الرابط مع الأصدقاء واطلب منهم تجربة التثبيت! 📱✨
