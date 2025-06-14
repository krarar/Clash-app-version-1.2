#!/usr/bin/env node

/**
 * PWA Validation Script for Clashy
 * يتحقق من صحة جميع ملفات PWA المطلوبة
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 بدء فحص ملفات كلاشي PWA...\n');

let errors = 0;
let warnings = 0;

// قائمة الملفات المطلوبة
const requiredFiles = [
    'index.html',
    'manifest.json',
    'sw.js'
];

// قائمة الملفات الاختيارية
const optionalFiles = [
    'README.md',
    'LICENSE',
    'package.json',
    'alhajami.html',
    'Al Ghadeer Office.html'
];

/**
 * طباعة رسالة ملونة
 */
function log(message, type = 'info') {
    const colors = {
        success: '\x1b[32m✅',
        error: '\x1b[31m❌',
        warning: '\x1b[33m⚠️',
        info: '\x1b[36mℹ️'
    };
    console.log(`${colors[type]} ${message}\x1b[0m`);
}

/**
 * فحص وجود الملفات
 */
function checkFiles() {
    log('فحص الملفات المطلوبة...', 'info');
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            log(`${file} موجود`, 'success');
        } else {
            log(`${file} مفقود!`, 'error');
            errors++;
        }
    });

    log('\nفحص الملفات الاختيارية...', 'info');
    
    optionalFiles.forEach(file => {
        if (fs.existsSync(file)) {
            log(`${file} موجود`, 'success');
        } else {
            log(`${file} مفقود (اختياري)`, 'warning');
            warnings++;
        }
    });
}

/**
 * فحص manifest.json
 */
function validateManifest() {
    log('\nفحص manifest.json...', 'info');
    
    if (!fs.existsSync('manifest.json')) {
        log('manifest.json غير موجود!', 'error');
        errors++;
        return;
    }

    try {
        const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
        
        // الحقول المطلوبة
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
        
        requiredFields.forEach(field => {
            if (manifest[field]) {
                log(`manifest.${field} موجود`, 'success');
            } else {
                log(`manifest.${field} مفقود!`, 'error');
                errors++;
            }
        });

        // فحص الأيقونات
        if (manifest.icons && Array.isArray(manifest.icons) && manifest.icons.length > 0) {
            log(`عدد الأيقونات: ${manifest.icons.length}`, 'success');
            
            const requiredSizes = ['192x192', '512x512'];
            requiredSizes.forEach(size => {
                const hasSize = manifest.icons.some(icon => icon.sizes === size);
                if (hasSize) {
                    log(`أيقونة بحجم ${size} موجودة`, 'success');
                } else {
                    log(`أيقونة بحجم ${size} مفقودة`, 'warning');
                    warnings++;
                }
            });
        } else {
            log('لا توجد أيقونات محددة!', 'error');
            errors++;
        }

    } catch (e) {
        log(`خطأ في تحليل manifest.json: ${e.message}`, 'error');
        errors++;
    }
}

/**
 * فحص Service Worker
 */
function validateServiceWorker() {
    log('\nفحص Service Worker...', 'info');
    
    if (!fs.existsSync('sw.js')) {
        log('sw.js غير موجود!', 'error');
        errors++;
        return;
    }

    const swContent = fs.readFileSync('sw.js', 'utf8');
    
    // فحص الأحداث المطلوبة
    const requiredEvents = ['install', 'activate', 'fetch'];
    
    requiredEvents.forEach(event => {
        if (swContent.includes(`addEventListener('${event}'`)) {
            log(`حدث ${event} موجود`, 'success');
        } else {
            log(`حدث ${event} مفقود!`, 'warning');
            warnings++;
        }
    });

    // فحص Cache API
    if (swContent.includes('caches.open')) {
        log('استخدام Cache API موجود', 'success');
    } else {
        log('استخدام Cache API مفقود', 'warning');
        warnings++;
    }
}

/**
 * فحص index.html
 */
function validateHTML() {
    log('\nفحص index.html...', 'info');
    
    if (!fs.existsSync('index.html')) {
        log('index.html غير موجود!', 'error');
        errors++;
        return;
    }

    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    // فحص DOCTYPE
    if (htmlContent.includes('<!DOCTYPE html>')) {
        log('DOCTYPE صحيح', 'success');
    } else {
        log('DOCTYPE مفقود أو غير صحيح!', 'error');
        errors++;
    }

    // فحص manifest link
    if (htmlContent.includes('rel="manifest"')) {
        log('رابط manifest موجود', 'success');
    } else {
        log('رابط manifest مفقود!', 'error');
        errors++;
    }

    // فحص meta viewport
    if (htmlContent.includes('name="viewport"')) {
        log('meta viewport موجود', 'success');
    } else {
        log('meta viewport مفقود!', 'error');
        errors++;
    }

    // فحص theme-color
    if (htmlContent.includes('name="theme-color"')) {
        log('theme-color موجود', 'success');
    } else {
        log('theme-color مفقود', 'warning');
        warnings++;
    }

    // فحص Service Worker registration
    if (htmlContent.includes('serviceWorker.register')) {
        log('تسجيل Service Worker موجود', 'success');
    } else {
        log('تسجيل Service Worker مفقود!', 'warning');
        warnings++;
    }
}

/**
 * فحص الأمان
 */
function validateSecurity() {
    log('\nفحص الأمان...', 'info');
    
    // فحص وجود مفاتيح API مكشوفة
    const files = ['index.html', 'sw.js'];
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            // نصائح أمنية
            if (content.includes('SUPABASE_ANON_KEY')) {
                log(`${file}: تأكد من أن مفتاح Supabase صحيح`, 'info');
            }
            
            if (content.includes('console.log') || content.includes('console.error')) {
                log(`${file}: يحتوي على console logs (قد تريد إزالتها في الإنتاج)`, 'warning');
                warnings++;
            }
        }
    });
}

/**
 * فحص الأداء
 */
function validatePerformance() {
    log('\nفحص الأداء...', 'info');
    
    if (fs.existsSync('index.html')) {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        // فحص تحميل الخطوط
        if (htmlContent.includes('fonts.googleapis.com')) {
            if (htmlContent.includes('display=swap')) {
                log('خطوط Google محسنة للأداء', 'success');
            } else {
                log('خطوط Google غير محسنة (أضف display=swap)', 'warning');
                warnings++;
            }
        }

        // فحص lazy loading
        if (htmlContent.includes('loading="lazy"')) {
            log('Lazy loading مفعل للصور', 'success');
        } else {
            log('Lazy loading غير مفعل للصور', 'warning');
            warnings++;
        }
    }
}

/**
 * إنشاء تقرير
 */
function generateReport() {
    log('\n📊 تقرير الفحص:', 'info');
    
    if (errors === 0 && warnings === 0) {
        log('🎉 رائع! جميع الفحوصات نجحت بدون أخطاء أو تحذيرات', 'success');
    } else if (errors === 0) {
        log(`✅ جيد! لا توجد أخطاء، ولكن هناك ${warnings} تحذير`, 'warning');
    } else {
        log(`❌ يوجد ${errors} خطأ و ${warnings} تحذير يحتاج إلى إصلاح`, 'error');
    }

    console.log('\n📋 ملخص:');
    console.log(`- الأخطاء: ${errors}`);
    console.log(`- التحذيرات: ${warnings}`);
    
    if (errors === 0) {
        console.log('\n🚀 PWA جاهز للنشر!');
        process.exit(0);
    } else {
        console.log('\n🔧 يرجى إصلاح الأخطاء قبل النشر');
        process.exit(1);
    }
}

/**
 * تشغيل جميع الفحوصات
 */
function runAllValidations() {
    checkFiles();
    validateManifest();
    validateServiceWorker();
    validateHTML();
    validateSecurity();
    validatePerformance();
    generateReport();
}

// تشغيل الفحوصات
runAllValidations();
