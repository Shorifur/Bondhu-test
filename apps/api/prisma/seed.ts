import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// All passwords are: Test@1234
const HASHED_PASSWORD = '$2a$10$6R4r8XyZqQWxQWxQWxQWx.QWxQWxQWxQWxQWxQWxQWxQWxQWxQW';

// 10 Bangladeshi test users
const TEST_USERS = [
  {
    legalName: 'রহিম আহমেদ',
    displayName: 'রহিম ভাই',
    handle: 'rahim-ahmed-7x3k',
    email: 'rahim@test.bondhu',
    phone: '+8801712345678',
    bio: 'ঢাকার একজন স্বাভাবিক ব্যবহারকারী। বন্ধুতে নতুন! 🇧🇩',
    location: 'Dhaka',
    districtId: 1,
    gender: 'male',
  },
  {
    legalName: 'সালমা বেগম',
    displayName: 'সালমা আপা',
    handle: 'salma-begum-9p2m',
    email: 'salma@test.bondhu',
    phone: '+8801712345679',
    bio: 'গৃহিণী ও উদ্যোক্তা। হস্তশিল্প পণ্য বিক্রি করি। 🧵',
    location: 'Chittagong',
    districtId: 2,
    gender: 'female',
  },
  {
    legalName: 'করিম উদ্দিন',
    displayName: 'করিম ভাই',
    handle: 'karim-uddin-4a8n',
    email: 'karim@test.bondhu',
    phone: '+8801712345680',
    bio: 'আইটি প্রফেশনাল। সফটওয়্যার ডেভেলপার। 💻',
    location: 'Sylhet',
    districtId: 6,
    gender: 'male',
  },
  {
    legalName: 'ফাতেমা খাতুন',
    displayName: 'ফাতেমা আপা',
    handle: 'fatema-khatun-2b5c',
    email: 'fatema@test.bondhu',
    phone: '+8801712345681',
    bio: 'শিক্ষিকা। শিক্ষা ও সাহিত্যে আগ্রহী। 📚',
    location: 'Rajshahi',
    districtId: 3,
    gender: 'female',
  },
  {
    legalName: 'জসিম উদ্দিন',
    displayName: 'জসিম ভাই',
    handle: 'josim-uddin-1d7e',
    email: 'josim@test.bondhu',
    phone: '+8801712345682',
    bio: 'কৃষক। কৃষি পণ্য উৎপাদন ও বিক্রি। 🌾',
    location: 'Khulna',
    districtId: 4,
    gender: 'male',
  },
  {
    legalName: 'আয়েশা সিদ্দিকা',
    displayName: 'আয়েশা আপা',
    handle: 'ayesha-siddiqa-6f3g',
    email: 'ayesha@test.bondhu',
    phone: '+8801712345683',
    bio: 'বিউটি ও সৌন্দর্য পণ্যের ব্যবসা। 💄',
    location: 'Barisal',
    districtId: 5,
    gender: 'female',
  },
  {
    legalName: 'মোহাম্মদ হাসান',
    displayName: 'হাসান ভাই',
    handle: 'mohammad-hasan-8h1j',
    email: 'hasan@test.bondhu',
    phone: '+8801712345684',
    bio: 'রেস্তোরাঁ ব্যবসায়ী। খাদ্য ও রন্ধনশিল্প। 🍜',
    location: 'Rangpur',
    districtId: 7,
    gender: 'male',
  },
  {
    legalName: 'নাসরিন আক্তার',
    displayName: 'নাসরিন আপা',
    handle: 'nasrin-akhtar-3k9l',
    email: 'nasrin@test.bondhu',
    phone: '+8801712345685',
    bio: 'ফ্রিল্যান্সার। গ্রাফিক ডিজাইনার। 🎨',
    location: 'Mymensingh',
    districtId: 8,
    gender: 'female',
  },
  {
    legalName: 'আবুল কালাম',
    displayName: 'কালাম ভাই',
    handle: 'abul-kalam-5m2p',
    email: 'kalam@test.bondhu',
    phone: '+8801712345686',
    bio: 'গার্মেন্টস কর্মী। পোশাক ব্যবসা। 👕',
    location: 'Dhaka',
    districtId: 1,
    gender: 'male',
  },
  {
    legalName: 'তাহমিনা আক্তার',
    displayName: 'তাহমিনা আপা',
    handle: 'tahmina-akhtar-7q4r',
    email: 'tahmina@test.bondhu',
    phone: '+8801712345687',
    bio: 'ডাক্তার। স্বাস্থ্য পরামর্শ দিই। 🏥',
    location: 'Comilla',
    districtId: 9,
    gender: 'female',
  },
];

// Test posts
const TEST_POSTS = [
  { content: 'আজকের আবহাওয়া দারুন! সকালের নাস্তায় পরোটা আর দোই। 🇧🇩✨', lang: 'bn' },
  { content: 'বন্ধুতে নতুন শপ খুলেছি! হস্তশিল্প পণ্য দেখে যান। 🛍️', lang: 'bn' },
  { content: 'ঢাকার ট্রাফিক আজ ভয়াবহ! কেউ মিরপুর যাওয়ার পথে আছেন? 🚗', lang: 'bn' },
  { content: 'নতুন চাকরির সার্কুলার! আমার শপে একজন সহকারী লাগবে। 💼', lang: 'bn' },
  { content: 'বাংলাদেশ ক্রিকেট দল জিতেছে! কী খুশির খবর! 🏏🇧🇩', lang: 'bn' },
  { content: 'Just launched my new shop on Bondhu! Check it out everyone! 🎉', lang: 'en' },
  { content: 'আমার গ্রামের বাড়ি থেকে তাজা সবজি বিক্রি হচ্ছে! 🥬🍅', lang: 'bn' },
  { content: 'কেউ ভালো ডাক্তার জানেন? হৃদরোগ বিশেষজ্ঞ লাগবে। 🏥', lang: 'bn' },
  { content: 'বন্ধুর নতুন আপডেট দারুন! UI কত সুন্দর হয়েছে! 😍', lang: 'bn' },
  { content: 'বিয়ের শপিং করতে গিয়েছিলাম। কত দাম! 😅💸', lang: 'bn' },
];

// Test shops
const TEST_SHOPS = [
  { name: 'রহিমের হস্তশিল্প', category: 'Handicrafts', description: 'পারম্পর্য হস্তশিল্প পণ্য। নকশিকাঁথা, শাড়ি, ও অন্যান্য।' },
  { name: 'সালমা কিচেন', category: 'Food', description: 'হোমমেড খাবার। বিরিয়ানি, কাবাব, মিষ্টি।' },
  { name: 'করিম টেক', category: 'Electronics', description: 'মোবাইল এক্সেসরিজ, গ্যাজেট, ও ইলেকট্রনিক্স।' },
  { name: 'ফাতেমা বুক সেন্টার', category: 'Books', description: 'বই ও শিক্ষা সামগ্রী। সকল শ্রেণীর বই পাওয়া যায়।' },
];

// Test products
const TEST_PRODUCTS = [
  { title: 'নকশিকাঁথা শাড়ি', price: 1500, description: 'হাতে তৈরি নকশিকাঁথা শাড়ি। বাংলাদেশের ঐতিহ্য।', condition: 'NEW' as const },
  { title: 'বাঁশের ঝুড়ি', price: 350, description: 'পারিবারিক ব্যবহারের জন্য বাঁশের তৈরি ঝুড়ি।', condition: 'NEW' as const },
  { title: 'মোবাইল চার্জার', price: 250, description: 'ফাস্ট চার্জিং সাপোর্টেড। সকল ফোনে কাজ করে।', condition: 'NEW' as const },
  { title: 'বিরিয়ানি (১ কেজি)', price: 500, description: 'ঘরোয়া বিরিয়ানি। তাজা ও সুস্বাদু।', condition: 'NEW' as const },
  { title: 'HSC গণিত বই', price: 180, description: 'নতুন HSC গণিত গাইড বই।', condition: 'LIKE_NEW' as const },
  { title: 'ব্লুটুথ হেডফোন', price: 800, description: 'ওয়্যারলেস ব্লুটুথ হেডফোন। ভালো সাউন্ড কোয়ালিটি।', condition: 'USED' as const },
];

// Test jobs
const TEST_JOBS = [
  { title: 'গ্রাফিক ডিজাইনার', description: 'লোগো, ব্যানার, ও সোশ্যাল মিডিয়া ডিজাইন। Illustrator ও Photoshop জানা আবশ্যক।', salaryMin: 15000, salaryMax: 30000, category: 'BUSINESS' as const, type: 'FULL_TIME' as const },
  { title: 'ডেলিভারি বয়', description: 'পণ্য ডেলিভারি করতে হবে। মোটরসাইকেল থাকতে হবে।', salaryMin: 12000, salaryMax: 18000, category: 'BUSINESS' as const, type: 'FULL_TIME' as const },
  { title: 'অনলাইন টিউটর', description: 'ক্লাস ৬-১০ এর শিক্ষার্থীদের পড়ানো। অনলাইনে ক্লাস নিতে হবে।', salaryMin: 10000, salaryMax: 20000, category: 'TEACHING' as const, type: 'PART_TIME' as const },
  { title: 'সেলসম্যান', description: 'দোকানে পণ্য বিক্রি ও গ্রাহক সেবা। ভালো যোগাযোগ দক্ষতা লাগবে।', salaryMin: 10000, salaryMax: 15000, category: 'BUSINESS' as const, type: 'FULL_TIME' as const },
];

async function main() {
  console.log('\uD83D\uDE80 Starting seed...\n');

  // Hash password properly
  const passwordHash = await bcrypt.hash('Test@1234', 10);

  // Create users
  const createdUsers = [];
  for (const userData of TEST_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) {
      console.log(`   \u26A0 User exists: ${userData.email}`);
      createdUsers.push(existing);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        legalName: userData.legalName,
        displayName: userData.displayName,
        handle: userData.handle,
        email: userData.email,
        passwordHash,
        phone: userData.phone,
        dateOfBirth: new Date('1995-01-01'),
        gender: userData.gender as any,
        role: 'USER',
        profile: {
          create: {
            bio: userData.bio,
            location: userData.location,
            phoneVerified: true,
            isPrivate: false,
          },
        },
      },
    });
    createdUsers.push(user);
    console.log(`   \u2705 User: ${userData.email} | ${userData.displayName}`);
  }

  // Create posts
  for (let i = 0; i < TEST_POSTS.length; i++) {
    const user = createdUsers[i % createdUsers.length];
    await prisma.post.create({
      data: {
        userId: user.id,
        content: TEST_POSTS[i].content,
        visibility: 'PUBLIC',
        lang: TEST_POSTS[i].lang as any,
      },
    });
  }
  console.log(`   \u2705 ${TEST_POSTS.length} posts created`);

  // Create shops with products
  for (let i = 0; i < TEST_SHOPS.length; i++) {
    const owner = createdUsers[i % createdUsers.length];
    const shopData = TEST_SHOPS[i];

    const existingShop = await prisma.shop.findFirst({ where: { name: shopData.name } });
    if (existingShop) continue;

    const shop = await prisma.shop.create({
      data: {
        ownerId: owner.id,
        name: shopData.name,
        handle: shopData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 6),
        description: shopData.description,
        category: shopData.category,
        districtId: 1,
        phone: '+8801712345678',
        isVerified: false,
      },
    });

    // Add 2-3 products per shop
    const productsForShop = TEST_PRODUCTS.slice(i * 1, i * 1 + 2);
    for (const prod of productsForShop) {
      await prisma.shopProduct.create({
        data: {
          shopId: shop.id,
          title: prod.title,
          description: prod.description,
          price: prod.price,
          stock: Math.floor(Math.random() * 50) + 5,
          condition: prod.condition,
          images: [],
          isNegotiable: Math.random() > 0.5,
          deliveryType: 'BOTH',
        },
      });
    }
    console.log(`   \u2705 Shop: ${shopData.name} (${productsForShop.length} products)`);
  }

  // Create jobs
  for (let i = 0; i < TEST_JOBS.length; i++) {
    const poster = createdUsers[(i + 2) % createdUsers.length];
    const jobData = TEST_JOBS[i];

    await prisma.job.create({
      data: {
        posterId: poster.id,
        title: jobData.title,
        description: jobData.description,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        category: jobData.category,
        type: jobData.type,
        isActive: true,
        location: 'Dhaka',
        contactInfo: '+8801712345678',
      },
    });
    console.log(`   \u2705 Job: ${jobData.title}`);
  }

  console.log('\n\uD83C\uDF89 Seed complete! 10 test accounts ready.');
  console.log('\n=== LOGIN CREDENTIALS ===');
  console.log('Email:    rahim@test.bondhu');
  console.log('Password: Test@1234');
  console.log('\nAll 10 accounts use the SAME password: Test@1234');
  console.log('Email format: [name]@test.bondhu');
  console.log('\uD83D\uDD10 All emails listed above');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
