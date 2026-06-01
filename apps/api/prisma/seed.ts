import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const TEST_USERS = [
  { legalName: 'রহিম আহমেদ', displayName: 'রহিম ভাই', handle: 'rahim-ahmed-7x3k', email: 'rahim@test.bondhu', phoneNumber: '+8801712345678', bio: 'ঢাকার একজন স্বাভাবিক ব্যবহারকারী। বন্ধুতে নতুন!', districtId: 1 },
  { legalName: 'সালমা বেগম', displayName: 'সালমা আপা', handle: 'salma-begum-9p2m', email: 'salma@test.bondhu', phoneNumber: '+8801712345679', bio: 'গৃহিণী ও উদ্যোক্তা। হস্তশিল্প পণ্য বিক্রি করি।', districtId: 2 },
  { legalName: 'করিম উদ্দিন', displayName: 'করিম ভাই', handle: 'karim-uddin-4a8n', email: 'karim@test.bondhu', phoneNumber: '+8801712345680', bio: 'আইটি প্রফেশনাল। সফটওয়্যার ডেভেলপার।', districtId: 6 },
  { legalName: 'ফাতেমা খাতুন', displayName: 'ফাতেমা আপা', handle: 'fatema-khatun-2b5c', email: 'fatema@test.bondhu', phoneNumber: '+8801712345681', bio: 'শিক্ষিকা। শিক্ষা ও সাহিত্যে আগ্রহী।', districtId: 3 },
  { legalName: 'জসিম উদ্দিন', displayName: 'জসিম ভাই', handle: 'josim-uddin-1d7e', email: 'josim@test.bondhu', phoneNumber: '+8801712345682', bio: 'কৃষক। কৃষি পণ্য উৎপাদন ও বিক্রি।', districtId: 4 },
  { legalName: 'আয়েশা সিদ্দিকা', displayName: 'আয়েশা আপা', handle: 'ayesha-siddiqa-6f3g', email: 'ayesha@test.bondhu', phoneNumber: '+8801712345683', bio: 'বিউটি ও সৌন্দর্য পণ্যের ব্যবসা।', districtId: 5 },
  { legalName: 'মোহাম্মদ হাসান', displayName: 'হাসান ভাই', handle: 'mohammad-hasan-8h1j', email: 'hasan@test.bondhu', phoneNumber: '+8801712345684', bio: 'রেস্তোরাঁ ব্যবসায়ী। খাদ্য ও রন্ধনশিল্প।', districtId: 7 },
  { legalName: 'নাসরিন আক্তার', displayName: 'নাসরিন আপা', handle: 'nasrin-akhtar-3k9l', email: 'nasrin@test.bondhu', phoneNumber: '+8801712345685', bio: 'ফ্রিল্যান্সার। গ্রাফিক ডিজাইনার।', districtId: 8 },
  { legalName: 'আবুল কালাম', displayName: 'কালাম ভাই', handle: 'abul-kalam-5m2p', email: 'kalam@test.bondhu', phoneNumber: '+8801712345686', bio: 'গার্মেন্টস কর্মী। পোশাক ব্যবসা।', districtId: 1 },
  { legalName: 'তাহমিনা আক্তার', displayName: 'তাহমিনা আপা', handle: 'tahmina-akhtar-7q4r', email: 'tahmina@test.bondhu', phoneNumber: '+8801712345687', bio: 'ডাক্তার। স্বাস্থ্য পরামর্শ দিই।', districtId: 9 },
];

const TEST_POSTS = [
  'আজকের আবহাওয়া দারুন! সকালের নাস্তায় পরোটা আর দোই। 🇧🇩✨',
  'বন্ধুতে নতুন শপ খুলেছি! হস্তশিল্প পণ্য দেখে যান। 🛍️',
  'ঢাকার ট্রাফিক আজ ভয়াবহ! কেউ মিরপুর যাওয়ার পথে আছেন? 🚗',
  'নতুন চাকরির সার্কুলার! আমার শপে একজন সহকারী লাগবে। 💼',
  'বাংলাদেশ ক্রিকেট দল জিতেছে! কী খুশির খবর! 🏏🇧🇩',
  'Just launched my new shop on Bondhu! Check it out everyone! 🎉',
  'আমার গ্রামের বাড়ি থেকে তাজা সবজি বিক্রি হচ্ছে! 🥬🍅',
  'কেউ ভালো ডাক্তার জানেন? হৃদরোগ বিশেষজ্ঞ লাগবে। 🏥',
  'বন্ধুর নতুন আপডেট দারুন! UI কত সুন্দর হয়েছে! 😍',
  'বিয়ের শপিং করতে গিয়েছিলাম। কত দাম! 😅💸',
];

const TEST_SHOPS = [
  { name: 'রহিমের হস্তশিল্প', category: 'Handicrafts', description: 'পারম্পর্য হস্তশিল্প পণ্য। নকশিকাঁথা, শাড়ি, ও অন্যান্য।' },
  { name: 'সালমা কিচেন', category: 'Food', description: 'হোমমেড খাবার। বিরিয়ানি, কাবাব, মিষ্টি।' },
  { name: 'করিম টেক', category: 'Electronics', description: 'মোবাইল এক্সেসরিজ, গ্যাজেট, ও ইলেকট্রনিক্স।' },
  { name: 'ফাতেমা বুক সেন্টার', category: 'Books', description: 'বই ও শিক্ষা সামগ্রী। সকল শ্রেণীর বই পাওয়া যায়।' },
];

const TEST_PRODUCTS = [
  { title: 'নকশিকাঁথা শাড়ি', price: 1500, description: 'হাতে তৈরি নকশিকাঁথা শাড়ি। বাংলাদেশের ঐতিহ্য।', condition: 'NEW' },
  { title: 'বাঁশের ঝুড়ি', price: 350, description: 'পারিবারিক ব্যবহারের জন্য বাঁশের তৈরি ঝুড়ি।', condition: 'NEW' },
  { title: 'মোবাইল চার্জার', price: 250, description: 'ফাস্ট চার্জিং সাপোর্টেড। সকল ফোনে কাজ করে।', condition: 'NEW' },
  { title: 'বিরিয়ানি (১ কেজি)', price: 500, description: 'ঘরোয়া বিরিয়ানি। তাজা ও সুস্বাদু।', condition: 'NEW' },
  { title: 'HSC গণিত বই', price: 180, description: 'নতুন HSC গণিত গাইড বই।', condition: 'LIKE_NEW' },
  { title: 'ব্লুটুথ হেডফোন', price: 800, description: 'ওয়্যারলেস ব্লুটুথ হেডফোন। ভালো সাউন্ড কোয়ালিটি।', condition: 'USED' },
];

const TEST_JOBS = [
  { title: 'গ্রাফিক ডিজাইনার', description: 'লোগো, ব্যানার, ও সোশ্যাল মিডিয়া ডিজাইন। Illustrator ও Photoshop জানা আবশ্যক।', salaryMin: 15000, salaryMax: 30000, category: 'BUSINESS' as const, type: 'FULL_TIME' as const },
  { title: 'ডেলিভারি বয়', description: 'পণ্য ডেলিভারি করতে হবে। মোটরসাইকেল থাকতে হবে।', salaryMin: 12000, salaryMax: 18000, category: 'BUSINESS' as const, type: 'FULL_TIME' as const },
  { title: 'অনলাইন টিউটর', description: 'ক্লাস ৬-১০ এর শিক্ষার্থীদের পড়ানো। অনলাইনে ক্লাস নিতে হবে।', salaryMin: 10000, salaryMax: 20000, category: 'TEACHING' as const, type: 'PART_TIME' as const },
  { title: 'সেলসম্যান', description: 'দোকানে পণ্য বিক্রি ও গ্রাহক সেবা। ভালো যোগাযোগ দক্ষতা লাগবে।', salaryMin: 10000, salaryMax: 15000, category: 'BUSINESS' as const, type: 'FULL_TIME' as const },
];

async function main() {
  console.log('Starting seed...\n');

  const passwordHash = await bcrypt.hash('Test@1234', 10);
  const createdUsers: any[] = [];

  // Create users
  for (const userData of TEST_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) {
      console.log('  User exists:', userData.email);
      createdUsers.push(existing);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        phoneNumber: userData.phoneNumber,
        phoneVerified: true,
        email: userData.email,
        emailVerified: true,
        passwordHash,
        profile: {
          create: {
            legalName: userData.legalName,
            displayName: userData.displayName,
            handle: userData.handle,
            bio: userData.bio,
            districtId: userData.districtId,
          },
        },
      },
    });
    createdUsers.push(user);
    console.log('  User:', userData.email, '|', userData.displayName);
  }

  // Create posts
  for (let i = 0; i < TEST_POSTS.length; i++) {
    const user = createdUsers[i % createdUsers.length];
    await prisma.post.create({
      data: {
        userId: user.id,
        content: TEST_POSTS[i],
        visibility: 'PUBLIC',
      },
    });
  }
  console.log('  ' + TEST_POSTS.length + ' posts created');

  // Create shops with products
  for (let i = 0; i < TEST_SHOPS.length; i++) {
    const owner = createdUsers[i % createdUsers.length];
    const shopData = TEST_SHOPS[i];

    const existingShop = await prisma.shop.findFirst({ where: { name: shopData.name } });
    if (existingShop) continue;

    const handle = shopData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 6);
    const shop = await prisma.shop.create({
      data: {
        ownerId: owner.id,
        name: shopData.name,
        handle,
        description: shopData.description,
        category: shopData.category,
        districtId: 1,
        phone: '+8801712345678',
      },
    });

    const productsForShop = TEST_PRODUCTS.slice(i * 1, i * 1 + 2);
    for (const prod of productsForShop) {
      await prisma.shopProduct.create({
        data: {
          shopId: shop.id,
          title: prod.title,
          description: prod.description,
          price: prod.price,
          stock: Math.floor(Math.random() * 50) + 5,
          condition: prod.condition as any,
          images: [],
          isNegotiable: Math.random() > 0.5,
          deliveryType: 'BOTH',
        },
      });
    }
    console.log('  Shop:', shopData.name, '(' + productsForShop.length + ' products)');
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
    console.log('  Job:', jobData.title);
  }

  console.log('\nSeed complete! 10 test accounts ready.\n');
  console.log('=== LOGIN CREDENTIALS ===');
  console.log('All accounts password: Test@1234');
  console.log('\n  1. rahim@test.bondhu    | রহিম আহমেদ');
  console.log('  2. salma@test.bondhu    | সালমা বেগম');
  console.log('  3. karim@test.bondhu    | করিম উদ্দিন');
  console.log('  4. fatema@test.bondhu   | ফাতেমা খাতুন');
  console.log('  5. josim@test.bondhu    | জসিম উদ্দিন');
  console.log('  6. ayesha@test.bondhu   | আয়েশা সিদ্দিকা');
  console.log('  7. hasan@test.bondhu    | মোহাম্মদ হাসান');
  console.log('  8. nasrin@test.bondhu   | নাসরিন আক্তার');
  console.log('  9. kalam@test.bondhu    | আবুল কালাম');
  console.log(' 10. tahmina@test.bondhu  | তাহমিনা আক্তার');
}

main()
  .catch((e: any) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
