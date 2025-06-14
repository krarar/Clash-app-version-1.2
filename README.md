# كلاشي - السوق الإلكتروني الشامل 🛍️

[![PWA](https://img.shields.io/badge/PWA-Enabled-brightgreen.svg)](https://github.com/your-username/clashy-app)
[![Arabic](https://img.shields.io/badge/Language-Arabic-blue.svg)](https://github.com/your-username/clashy-app)
[![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-success.svg)](https://your-username.github.io/clashy-app)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📱 تطبيق ويب تقدمي (PWA) 

**كلاشي** هو سوق إلكتروني شامل يجمع أفضل المتاجر والمنتجات العراقية في مكان واحد. يمكن تثبيته على الهاتف والعمل بدون إنترنت!

### 🌟 الميزات الرئيسية

- 🏪 **إدارة المتاجر**: إنشاء وإدارة المتاجر بسهولة
- 📦 **كتالوج المنتجات**: عرض منتجات من متاجر متنوعة
- ❤️ **قائمة المفضلة**: حفظ المنتجات المفضلة
- 🛒 **سلة التسوق**: إدارة متقدمة لسلة التسوق
- 🌓 **الوضع المظلم/الفاتح**: تبديل سهل بين الأوضاع
- 🔍 **البحث والفلترة**: بحث ذكي وفلترة متقدمة
- 📱 **PWA**: قابل للتثبيت على الهواتف
- 🔄 **العمل بدون إنترنت**: تخزين محلي وتزامن تلقائي
- 🎨 **تصميم متجاوب**: يعمل على جميع الأجهزة

## 🚀 رابط التطبيق المباشر

**[افتح كلاشي الآن](https://your-username.github.io/clashy-app/)**

## 📲 كيفية تثبيت التطبيق على الهاتف

### 📱 على Android:
1. افتح الرابط في Chrome
2. انقر على قائمة المتصفح (⋮)
3. اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"
4. اتبع التعليمات لإكمال التثبيت

### 🍎 على iPhone/iPad:
1. افتح الرابط في Safari
2. انقر على زر المشاركة (📤)
3. اختر "إضافة إلى الشاشة الرئيسية"
4. أدخل اسم التطبيق واضغط "إضافة"

### 💻 على سطح المكتب:
1. افتح الرابط في Chrome أو Edge
2. ابحث عن أيقونة التثبيت في شريط العنوان
3. انقر على "تثبيت" أو "Install"

## 🛠️ التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Custom CSS with CSS Variables
- **Database**: Supabase (PostgreSQL)
- **Storage**: LocalStorage + Supabase Storage
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Font Awesome 6.5.0
- **Fonts**: Google Fonts (Tajawal)
- **Hosting**: GitHub Pages

## 📁 هيكل المشروع

```
clashy-app/
├── index.html              # الملف الرئيسي للتطبيق
├── manifest.json           # إعدادات PWA
├── sw.js                   # Service Worker
├── alhajami.html          # صفحة متجر الحجامي
├── Al Ghadeer Office.html  # صفحة مكتب الغدير
├── README.md              # هذا الملف
├── LICENSE                # رخصة المشروع
└── assets/                # المجلد الاختياري للملفات
    ├── icons/             # الأيقونات
    ├── images/            # الصور
    └── screenshots/       # لقطات الشاشة
```

## ⚙️ إعداد المشروع

### 1. استنساخ المشروع
```bash
git clone https://github.com/your-username/clashy-app.git
cd clashy-app
```

### 2. إعداد قاعدة البيانات (Supabase)
1. أنشئ حساب على [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. أنشئ الجداول التالية:

#### جدول `products`:
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  images TEXT[],
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### جدول `ghadeer_products`:
```sql
CREATE TABLE ghadeer_products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  images TEXT[],
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### جدول `stores`:
```sql
CREATE TABLE stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  icon TEXT,
  color TEXT,
  category TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### جدول `clashy_products`:
```sql
CREATE TABLE clashy_products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  images TEXT[],
  category TEXT,
  store_name TEXT,
  store_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. تحديث إعدادات Supabase
في ملف `index.html`، حدث:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 4. رفع على GitHub
```bash
git add .
git commit -m "Initial commit: Clashy PWA"
git branch -M main
git remote add origin https://github.com/your-username/clashy-app.git
git push -u origin main
```

### 5. تفعيل GitHub Pages
1. اذهب إلى Settings في مستودع GitHub
2. انقر على Pages في القائمة الجانبية
3. اختر Source: Deploy from a branch
4. اختر Branch: main
5. اختر Folder: / (root)
6. انقر Save

## 🔧 التخصيص

### تغيير الألوان:
عدل متغيرات CSS في `:root`:
```css
:root {
  --primary-solid: #8B5CF6;  /* اللون الأساسي */
  --secondary-solid: #06B6D4; /* اللون الثانوي */
  /* ... باقي الألوان */
}
```

### إضافة متاجر جديدة:
1. أنشئ ملف HTML جديد للمتجر
2. أضف المتجر في قائمة `defaultStores` في JavaScript
3. أضف منتجات المتجر في قاعدة البيانات

### تخصيص الأيقونات:
1. أضف الأيقونات في مجلد `assets/icons/`
2. حدث مسارات الأيقونات في `manifest.json`

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📞 التواصل والدعم

- **الهاتف**: 07813798636
- **البريد الإلكتروني**: info@clashy.iq
- **واتساب**: [تواصل معنا](https://wa.me/9647813798636)

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 شكر وتقدير

- **Font Awesome** للأيقونات الرائعة
- **Google Fonts** للخطوط العربية
- **Supabase** لقاعدة البيانات السحابية
- **GitHub** للاستضافة المجانية

## 📈 الإحصائيات

- ⭐ النجوم: ![GitHub stars](https://img.shields.io/github/stars/your-username/clashy-app?style=social)
- 🍴 Forks: ![GitHub forks](https://img.shields.io/github/forks/your-username/clashy-app?style=social)
- 📥 التحميلات: ![GitHub downloads](https://img.shields.io/github/downloads/your-username/clashy-app/total)

## 🔄 سجل التحديثات

### v2.1.0 (2024-01-20)
- ✅ إصلاح مشاكل الصور والروابط
- ✅ تحسين الأداء والاستقرار
- ✅ إضافة زر تحديث البيانات
- ✅ دعم أفضل لـ PWA

### v2.0.0 (2024-01-15)
- ✅ إطلاق النسخة الكاملة
- ✅ دعم PWA كامل
- ✅ نظام المفضلة والسلة
- ✅ تبديل الوضع المظلم/الفاتح

### v1.0.0 (2024-01-10)
- 🎉 الإطلاق الأولي

---

**صنع بـ ❤️ في العراق 🇮🇶**

*كلاشي - حيث تجد كل ما تحتاجه في مكان واحد*
