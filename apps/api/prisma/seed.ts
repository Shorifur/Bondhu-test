import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';

const prisma = new PrismaClient();

/* ── Password hashing (same as auth service) ── */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/* ── 64 Bangladesh Districts ── */
const DISTRICTS = [
  // Dhaka Division (13)
  { id: 1, nameBn: 'ঢাকা', nameEn: 'Dhaka', division: 'Dhaka', latitude: 23.8103, longitude: 90.4125 },
  { id: 2, nameBn: 'ফরিদপুর', nameEn: 'Faridpur', division: 'Dhaka', latitude: 23.6070, longitude: 89.8429 },
  { id: 3, nameBn: 'গাজীপুর', nameEn: 'Gazipur', division: 'Dhaka', latitude: 23.9999, longitude: 90.4203 },
  { id: 4, nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', division: 'Dhaka', latitude: 23.0050, longitude: 89.8266 },
  { id: 5, nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', division: 'Dhaka', latitude: 24.4449, longitude: 90.7766 },
  { id: 6, nameBn: 'মাদারীপুর', nameEn: 'Madaripur', division: 'Dhaka', latitude: 23.1643, longitude: 90.1897 },
  { id: 7, nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', division: 'Dhaka', latitude: 23.8617, longitude: 89.9500 },
  { id: 8, nameBn: 'মুন্সিগঞ্জ', nameEn: 'Munshiganj', division: 'Dhaka', latitude: 23.5422, longitude: 90.5305 },
  { id: 9, nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', division: 'Dhaka', latitude: 23.6238, longitude: 90.5000 },
  { id: 10, nameBn: 'নরসিংদী', nameEn: 'Narsingdi', division: 'Dhaka', latitude: 23.9193, longitude: 90.7176 },
  { id: 11, nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', division: 'Dhaka', latitude: 23.7573, longitude: 89.6440 },
  { id: 12, nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', division: 'Dhaka', latitude: 23.2423, longitude: 90.4348 },
  { id: 13, nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', division: 'Dhaka', latitude: 24.2513, longitude: 89.9167 },

  // Chattogram Division (11)
  { id: 14, nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', division: 'Chattogram', latitude: 22.3569, longitude: 91.7832 },
  { id: 15, nameBn: 'বান্দরবান', nameEn: 'Bandarban', division: 'Chattogram', latitude: 22.1953, longitude: 92.2184 },
  { id: 16, nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', division: 'Chattogram', latitude: 23.9571, longitude: 91.1111 },
  { id: 17, nameBn: 'চাঁদপুর', nameEn: 'Chandpur', division: 'Chattogram', latitude: 23.2333, longitude: 90.6667 },
  { id: 18, nameBn: 'কুমিল্লা', nameEn: 'Cumilla', division: 'Chattogram', latitude: 23.4607, longitude: 91.1809 },
  { id: 19, nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", division: 'Chattogram', latitude: 21.4272, longitude: 92.0058 },
  { id: 20, nameBn: 'ফেনী', nameEn: 'Feni', division: 'Chattogram', latitude: 23.0159, longitude: 91.3976 },
  { id: 21, nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', division: 'Chattogram', latitude: 23.1193, longitude: 91.9850 },
  { id: 22, nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', division: 'Chattogram', latitude: 22.9425, longitude: 90.8412 },
  { id: 23, nameBn: 'নোয়াখালী', nameEn: 'Noakhali', division: 'Chattogram', latitude: 22.8690, longitude: 91.0995 },
  { id: 24, nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', division: 'Chattogram', latitude: 22.7324, longitude: 92.2986 },

  // Khulna Division (10)
  { id: 25, nameBn: 'খুলনা', nameEn: 'Khulna', division: 'Khulna', latitude: 22.8456, longitude: 89.5403 },
  { id: 26, nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', division: 'Khulna', latitude: 22.6512, longitude: 89.7851 },
  { id: 27, nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', division: 'Khulna', latitude: 23.6402, longitude: 88.8410 },
  { id: 28, nameBn: 'যশোর', nameEn: 'Jashore', division: 'Khulna', latitude: 23.1664, longitude: 89.2081 },
  { id: 29, nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', division: 'Khulna', latitude: 23.5448, longitude: 89.1531 },
  { id: 30, nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', division: 'Khulna', latitude: 23.9013, longitude: 89.1206 },
  { id: 31, nameBn: 'মাগুরা', nameEn: 'Magura', division: 'Khulna', latitude: 23.4873, longitude: 89.4194 },
  { id: 32, nameBn: 'মেহেরপুর', nameEn: 'Meherpur', division: 'Khulna', latitude: 23.7622, longitude: 88.6318 },
  { id: 33, nameBn: 'নড়াইল', nameEn: 'Narail', division: 'Khulna', latitude: 23.1725, longitude: 89.5127 },
  { id: 34, nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', division: 'Khulna', latitude: 22.7185, longitude: 89.0708 },

  // Rajshahi Division (8)
  { id: 35, nameBn: 'রাজশাহী', nameEn: 'Rajshahi', division: 'Rajshahi', latitude: 24.3745, longitude: 88.6042 },
  { id: 36, nameBn: 'বগুড়া', nameEn: 'Bogura', division: 'Rajshahi', latitude: 24.8481, longitude: 89.3730 },
  { id: 37, nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', division: 'Rajshahi', latitude: 24.5965, longitude: 88.2775 },
  { id: 38, nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', division: 'Rajshahi', latitude: 25.0968, longitude: 89.0227 },
  { id: 39, nameBn: 'নওগাঁ', nameEn: 'Naogaon', division: 'Rajshahi', latitude: 24.9132, longitude: 88.7531 },
  { id: 40, nameBn: 'নাটোর', nameEn: 'Natore', division: 'Rajshahi', latitude: 24.4206, longitude: 89.0000 },
  { id: 41, nameBn: 'পাবনা', nameEn: 'Pabna', division: 'Rajshahi', latitude: 24.0129, longitude: 89.2196 },
  { id: 42, nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', division: 'Rajshahi', latitude: 24.4534, longitude: 89.7007 },

  // Barishal Division (6)
  { id: 43, nameBn: 'বরিশাল', nameEn: 'Barishal', division: 'Barishal', latitude: 22.7010, longitude: 90.3535 },
  { id: 44, nameBn: 'বরগুনা', nameEn: 'Barguna', division: 'Barishal', latitude: 22.0953, longitude: 90.1121 },
  { id: 45, nameBn: 'ভোলা', nameEn: 'Bhola', division: 'Barishal', latitude: 22.6859, longitude: 90.6482 },
  { id: 46, nameBn: 'ঝালকাঠি', nameEn: 'Jhalokati', division: 'Barishal', latitude: 22.6406, longitude: 90.1987 },
  { id: 47, nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', division: 'Barishal', latitude: 22.3596, longitude: 90.3290 },
  { id: 48, nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', division: 'Barishal', latitude: 22.5842, longitude: 89.9731 },

  // Sylhet Division (4)
  { id: 49, nameBn: 'সিলেট', nameEn: 'Sylhet', division: 'Sylhet', latitude: 24.8949, longitude: 91.8687 },
  { id: 50, nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', division: 'Sylhet', latitude: 24.3745, longitude: 91.4125 },
  { id: 51, nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', division: 'Sylhet', latitude: 24.4829, longitude: 91.7773 },
  { id: 52, nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', division: 'Sylhet', latitude: 25.0658, longitude: 91.3950 },

  // Rangpur Division (8)
  { id: 53, nameBn: 'রংপুর', nameEn: 'Rangpur', division: 'Rangpur', latitude: 25.7466, longitude: 89.2517 },
  { id: 54, nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', division: 'Rangpur', latitude: 25.6275, longitude: 88.6378 },
  { id: 55, nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', division: 'Rangpur', latitude: 25.3294, longitude: 89.5415 },
  { id: 56, nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', division: 'Rangpur', latitude: 25.8054, longitude: 89.6366 },
  { id: 57, nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', division: 'Rangpur', latitude: 25.9913, longitude: 89.2845 },
  { id: 58, nameBn: 'নীলফামারী', nameEn: 'Nilphamari', division: 'Rangpur', latitude: 25.9312, longitude: 88.8561 },
  { id: 59, nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', division: 'Rangpur', latitude: 26.3411, longitude: 88.5542 },
  { id: 60, nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', division: 'Rangpur', latitude: 26.0339, longitude: 88.4695 },

  // Mymensingh Division (4)
  { id: 61, nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', division: 'Mymensingh', latitude: 24.7471, longitude: 90.4203 },
  { id: 62, nameBn: 'জামালপুর', nameEn: 'Jamalpur', division: 'Mymensingh', latitude: 24.9193, longitude: 89.9481 },
  { id: 63, nameBn: 'নেত্রকোনা', nameEn: 'Netrokona', division: 'Mymensingh', latitude: 24.8835, longitude: 90.7270 },
  { id: 64, nameBn: 'শেরপুর', nameEn: 'Sherpur', division: 'Mymensingh', latitude: 25.0195, longitude: 90.0137 },
];

/* ── Test Users ── */
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

/* ── Main Seed Function ── */
async function main() {
  console.log('🌱 Starting Bondhu seed...\n');

  /* ── 1. Seed 64 Districts ── */
  console.log('📍 Seeding 64 districts...');
  let districtCount = 0;
  for (const d of DISTRICTS) {
    await prisma.district.upsert({
      where: { id: d.id },
      update: {},
      create: d,
    });
    districtCount++;
  }
  console.log(`   ✅ ${districtCount} districts seeded\n`);

  /* ── 2. Seed Test Users ── */
  console.log('👥 Creating 10 test users...');
  const passwordHash = hashPassword('Test@1234');
  const createdUsers: any[] = [];

  for (const userData of TEST_USERS) {
    const existingByEmail = await prisma.user.findUnique({ where: { email: userData.email } }).catch(() => null);
    const existingByPhone = await prisma.user.findUnique({ where: { phoneNumber: userData.phoneNumber } }).catch(() => null);
    const existing = existingByEmail || existingByPhone;
    if (existing) {
      console.log('   ⏭️  User exists:', userData.email);
      createdUsers.push(existing);
      continue;
    }

    try {
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
      console.log('   ✅', userData.displayName);
    } catch (err: any) {
      if (err.code === 'P2002') {
        console.log('   ⏭️  Skipped duplicate:', userData.email);
        const found = await prisma.user.findUnique({ where: { email: userData.email } });
        if (found) createdUsers.push(found);
      } else {
        throw err;
      }
    }
  }

  /* ── 3. Create Settings & Preferences for each user ── */
  for (const user of createdUsers) {
    const settingsExists = await prisma.userSettings.findUnique({ where: { userId: user.id } }).catch(() => null);
    if (!settingsExists) {
      await prisma.userSettings.create({ data: { userId: user.id } });
    }
    const prefsExists = await prisma.userPreference.findUnique({ where: { userId: user.id } }).catch(() => null);
    if (!prefsExists) {
      await prisma.userPreference.create({ data: { userId: user.id } });
    }
  }
  console.log('   ✅ User settings & preferences created\n');

  /* ── 4. Create Posts ── */
  console.log('📝 Creating posts...');
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
  console.log(`   ✅ ${TEST_POSTS.length} posts created\n`);

  /* ── 5. Create Shops with Products ── */
  console.log('🛍️  Creating shops & products...');
  for (let i = 0; i < TEST_SHOPS.length; i++) {
    const owner = createdUsers[i % createdUsers.length];
    const shopData = TEST_SHOPS[i];

    const existingShop = await prisma.shop.findFirst({ where: { name: shopData.name } });
    if (existingShop) {
      console.log('   ⏭️  Shop exists:', shopData.name);
      continue;
    }

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
    console.log(`   ✅ ${shopData.name} (${productsForShop.length} products)`);
  }
  console.log('');

  /* ── 6. Create Jobs ── */
  console.log('💼 Creating jobs...');
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
    console.log('   ✅', jobData.title);
  }

  /* ── Summary ── */
  console.log('\n═══════════════════════════════════════════');
  console.log('🎉 SEED COMPLETE!');
  console.log('═══════════════════════════════════════════');
  console.log(`📍 ${districtCount} districts`);
  console.log(`👥 ${createdUsers.length} test users`);
  console.log(`📝 ${TEST_POSTS.length} posts`);
  console.log(`🛍️  ${TEST_SHOPS.length} shops with products`);
  console.log(`💼 ${TEST_JOBS.length} jobs`);
  console.log('\n=== LOGIN CREDENTIALS ===');
  console.log('Password for ALL accounts: Test@1234\n');
  TEST_USERS.forEach((u, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. ${u.email.padEnd(25)} | ${u.displayName}`);
  });
  console.log('\nDistrict FK constraint: ✅ FIXED');
  console.log('Registration will now work with any of the 64 districts!');
}

main()
  .catch((e: any) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
