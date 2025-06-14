# 🚀 دليل رفع ونشر كلاشي PWA على GitHub

## 📋 الخطوات المطلوبة

### 1️⃣ إنشاء مستودع GitHub جديد

1. اذهب إلى [GitHub.com](https://github.com)
2. انقر على "New Repository" أو "مستودع جديد"
3. أدخل اسم المستودع: `clashy-app`
4. اجعل المستودع **Public** (عام)
5. ✅ اختر "Add a README file"
6. اختر License: **MIT License**
7. انقر "Create repository"

### 2️⃣ رفع الملفات إلى GitHub

#### الطريقة الأولى: عبر واجهة GitHub (سهلة)

1. **رفع الملفات الأساسية:**
   - انقر "uploading an existing file" في المستودع
   - اسحب وأفلت الملفات التالية:
     - `index.html`
     - `manifest.json`
     - `sw.js`
     - `alhajami.html` (إذا كان موجود)
     - `Al Ghadeer Office.html` (إذا كان موجود)

2. **إنشاء مجلد `.github/workflows/`:**
   - انقر "Create new file"
   - اكتب: `.github/workflows/deploy.yml`
   - انسخ محتوى ملف النشر التلقائي
   - انقر "Commit new file"

#### الطريقة الثانية: عبر Git (متقدمة)

```bash
# استنساخ المستودع
git clone https://github.com/your-username/clashy-app.git
cd clashy-app

# إضافة الملفات
# انسخ جميع الملفات إلى هذا المجلد

# رفع الملفات
git add .
git commit -m "🎉 Initial commit: Clashy PWA v2.1"
git push origin main
```

### 3️⃣ تفعيل GitHub Pages

1. اذهب إلى **Settings** في مستودع GitHub
2. انقر على **Pages** في القائمة الجانبية
3. في قسم **Source**:
   - اختر **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. انقر **Save**
5. انتظر 2-5 دقائق للنشر

### 4️⃣ اختبار التطبيق

1. **الرابط سيكون:** `https://your-username.github.io/clashy-app/`
2. **اختبر PWA:**
   - افتح الرابط في Chrome أو Safari
   - تأكد من ظهور أيقونة التثبيت
   - جرب تثبيت التطبيق

### 5️⃣ تخصيص الروابط في README

عدل ملف `README.md` وغير:
- `your-username` → اسم المستخدم الحقيقي
- `clashy-app` → اسم المستودع الحقيقي

## ⚙️ إعدادات إضافية

### 🔧 إعداد قاعدة البيانات Supabase

1. **إنشاء مشروع:**
   - اذهب إلى [Supabase.com](https://supabase.com)
   - أنشئ حساب جديد
   - انقر "New Project"
   - أدخل تفاصيل المشروع

2. **إنشاء الجداول:**
   ```sql
   -- جدول المنتجات الرئيسي
   CREATE TABLE products (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price NUMERIC DEFAULT 0,
     images TEXT[], -- أو TEXT إذا كان رابط واحد
     image_url TEXT, -- دعم إضافي
     image TEXT,     -- دعم إضافي
     cost NUMERIC,   -- دعم إضافي
     category TEXT DEFAULT 'textiles',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- جدول منتجات الغدير
   CREATE TABLE ghadeer_products (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price NUMERIC DEFAULT 0,
     images TEXT[],
     image_url TEXT,
     image TEXT,
     cost NUMERIC,
     category TEXT DEFAULT 'electronics',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- جدول المتاجر
   CREATE TABLE stores (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     url TEXT,
     icon TEXT DEFAULT 'fas fa-store',
     color TEXT DEFAULT 'primary',
     category TEXT,
     available BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- جدول المنتجات العامة
   CREATE TABLE clashy_products (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price NUMERIC DEFAULT 0,
     images TEXT[],
     image_url TEXT,
     image TEXT,
     cost NUMERIC,
     category TEXT DEFAULT 'general',
     store_name TEXT,
     store_url TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **الحصول على مفاتيح API:**
   - اذهب إلى Settings → API
   - انسخ **Project URL** و **anon public key**

4. **تحديث التطبيق:**
   ```javascript
   // في ملف index.html
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

### 🛡️ أمان قاعدة البيانات

1. **RLS (Row Level Security):**
   ```sql
   -- تفعيل RLS للجداول
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ghadeer_products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
   ALTER TABLE clashy_products ENABLE ROW LEVEL SECURITY;

   -- سياسات للقراءة العامة
   CREATE POLICY "Allow public read access" ON products
     FOR SELECT USING (true);

   CREATE POLICY "Allow public read access" ON ghadeer_products
     FOR SELECT USING (true);

   CREATE POLICY "Allow public read access" ON stores
     FOR SELECT USING (true);

   CREATE POLICY "Allow public read access" ON clashy_products
     FOR SELECT USING (true);

   -- سياسات للإدراج (يمكن تقييدها حسب الحاجة)
   CREATE POLICY "Allow public insert" ON stores
     FOR INSERT WITH CHECK (true);
   ```

### 📱 اختبار PWA

1. **على Android:**
   ```
   1. افتح Chrome
   2. اذهب إلى الرابط
   3. انقر قائمة Chrome (⋮)
   4. "Add to Home screen" أو "Install app"
   ```

2. **على iPhone:**
   ```
   1. افتح Safari
   2. اذهب إلى الرابط
   3. انقر زر المشاركة (📤)
   4. "Add to Home Screen"
   ```

3. **على سطح المكتب:**
   ```
   1. افتح Chrome/Edge
   2. ابحث عن أيقونة + في العنوان
   3. انقر "Install"
   ```

## 🔍 استكشاف الأخطاء

### ❌ لا يعمل التثبيت كـ PWA
**الحلول:**
- تأكد من وجود `manifest.json`
- تأكد من وجود `sw.js`
- تأكد من رابط manifest في HTML
- تأكد من HTTPS (GitHub Pages يوفر HTTPS تلقائياً)

### ❌ لا تظهر الصور
**الحلول:**
- تأكد من وجود البيانات في قاعدة البيانات
- تأكد من صحة روابط الصور
- افحص console للأخطاء

### ❌ لا يعمل Service Worker
**الحلول:**
- تأكد من مسار `sw.js` صحيح
- افحص console للأخطاء
- تأكد من HTTPS

### ❌ مشاكل قاعدة البيانات
**الحلول:**
- تأكد من صحة URL ومفتاح Supabase
- تأكد من وجود الجداول
- تأكد من سياسات RLS

## 📊 مراقبة الأداء

### GitHub Actions
- تابع النشر في تبويب **Actions**
- سيتم النشر تلقائياً عند كل تحديث

### Analytics (اختياري)
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🎯 النتيجة النهائية

بعد اتباع هذه الخطوات، ستحصل على:

✅ **رابط مباشر:** `https://your-username.github.io/clashy-app/`
✅ **PWA قابل للتثبيت** على جميع الأجهزة
✅ **يعمل بدون إنترنت** بعد أول زيارة
✅ **تحديثات تلقائية** عند رفع كود جديد
✅ **أداء سريع** مع التخزين المؤقت
✅ **دعم كامل للهواتف** والأجهزة اللوحية

## 🚀 خطوات ما بعد النشر

1. **شارك الرابط** مع المستخدمين
2. **اطلب تجربة التثبيت** على أجهزة مختلفة
3. **راقب الأخطاء** في GitHub Issues
4. **استمع للتعليقات** وحدث التطبيق
5. **أضف ميزات جديدة** بانتظام

## 📞 الدعم

إذا واجهت أي مشاكل:
- افتح **Issue** في GitHub
- تواصل عبر **واتساب**: 07813798636
- ارسل **بريد إلكتروني**: info@clashy.iq

---

**مبروك! 🎉 تطبيق كلاشي PWA جاهز للاستخدام!**
