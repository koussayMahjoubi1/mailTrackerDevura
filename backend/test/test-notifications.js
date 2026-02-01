/**
 * Test script for the Notification System
 * Run with: node test/test-notifications.js
 */

import { NotificationService } from '../src/services/notification.service.js';
import { EmailTemplateBuilder } from '../src/utils/emailTemplates.js';

console.log('🧪 Testing Notification System\n');
console.log('='.repeat(80));

// Test 1: Check Provider Status
console.log('\n📋 Test 1: Checking notification providers...\n');
const notificationService = new NotificationService();
const status = notificationService.getProviderStatus();

console.log('Provider Status:');
status.providers.forEach(provider => {
    const icon = provider.configured ? '✅' : '❌';
    console.log(`  ${icon} ${provider.name}: ${provider.configured ? 'Configured' : 'Not Configured'}`);
});
console.log(`\n🎯 Primary Provider: ${status.primary}`);

// Test 2: Generate Email Templates
console.log('\n' + '='.repeat(80));
console.log('\n📧 Test 2: Testing email template generation...\n');

const mockPixel = {
    id: 'test-pixel-id',
    pixel_id: 'test-pixel-123',
    name: 'Test Campaign Email',
    user_id: 'test-user-id'
};

const mockLink = {
    id: 'test-link-id',
    link_id: 'test-link-123',
    name: 'Test CTA Link',
    original_url: 'https://example.com/landing-page',
    user_id: 'test-user-id'
};

const mockEvent = {
    id: 'test-event-id',
    created_at: new Date().toISOString(),
    metadata: {
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    }
};

// Test email open template
console.log('✓ Generating Email Open template...');
const openTemplate = EmailTemplateBuilder.buildOpenNotification(mockPixel, mockEvent);
console.log(`  Subject: ${openTemplate.subject}`);
console.log(`  HTML Length: ${openTemplate.html.length} characters`);

// Test link click template
console.log('\n✓ Generating Link Click template...');
const clickTemplate = EmailTemplateBuilder.buildClickNotification(mockLink, mockEvent);
console.log(`  Subject: ${clickTemplate.subject}`);
console.log(`  HTML Length: ${clickTemplate.html.length} characters`);

// Test reply template
console.log('\n✓ Generating Reply template...');
const replyTemplate = EmailTemplateBuilder.buildReplyNotification(mockPixel, mockEvent);
console.log(`  Subject: ${replyTemplate.subject}`);
console.log(`  HTML Length: ${replyTemplate.html.length} characters`);

// Test 3: Provider Configuration
console.log('\n' + '='.repeat(80));
console.log('\n⚙️  Test 3: Checking email configuration...\n');

const emailProvider = notificationService.providers.find(p => p.getName() === 'email');
if (emailProvider && emailProvider.isConfigured()) {
    console.log('✅ Email provider is configured and ready!');
    console.log('   You can send real email notifications.');

    // Test verification
    try {
        const verified = await emailProvider.verify();
        if (verified) {
            console.log('✅ SMTP server connection verified!');
        } else {
            console.log('⚠️  SMTP server verification failed');
        }
    } catch (error) {
        console.log('⚠️  Could not verify SMTP connection:', error.message);
    }
} else {
    console.log('⚠️  Email provider not configured');
    console.log('   Notifications will be logged to console only.');
    console.log('   To enable email notifications, configure SMTP in .env file:');
    console.log('   - SMTP_HOST');
    console.log('   - SMTP_PORT');
    console.log('   - SMTP_USER');
    console.log('   - SMTP_PASS');
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('\n📊 Test Summary\n');
console.log('✅ Notification Service initialized');
console.log('✅ Email templates generated successfully');
console.log(`${emailProvider?.isConfigured() ? '✅' : '⚠️ '} Email provider ${emailProvider?.isConfigured() ? 'configured' : 'not configured'}`);
console.log('✅ Console provider available');

console.log('\n💡 Next Steps:\n');
if (emailProvider?.isConfigured()) {
    console.log('1. Start the backend: npm run dev');
    console.log('2. Test via API: POST /api/notifications/test');
    console.log('3. Create a tracking pixel and test real tracking');
} else {
    console.log('1. Configure SMTP settings in .env file');
    console.log('2. Restart the backend');
    console.log('3. Run this test again');
    console.log('\nAlternatively, you can test with console logging:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Check console output when tracking events occur');
}

console.log('\n' + '='.repeat(80));
console.log('\n✨ Notification system test complete!\n');
