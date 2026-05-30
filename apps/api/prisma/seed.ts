import { PrismaClient, District, SubDistrict } from '@prisma/client';

const prisma = new PrismaClient();

const divisions: Record<string, string[]> = {
  Barisal: ['Barguna', 'Barisal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Chittagong: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Comilla', 'Cox\'s Bazar', 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  Khulna: ['Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
  Rajshahi: ['Bogra', 'Chapainawabganj', 'Naogaon', 'Natore', 'Pabna', 'Rajshahi', 'Sirajganj'],
  Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
};

// Sample sub-districts for major districts (full list would be ~500+)
const subDistrictSamples: Record<string, string[]> = {
  Dhaka: ['Dhanmondi', 'Gulshan', 'Mohammadpur', 'Mirpur', 'Uttara', 'Tejgaon', 'Ramna', 'Sutrapur', 'Sabujbagh', 'Demra'],
  Chittagong: ['Kotwali', 'Double Mooring', 'Halishahar', 'Pahartali', 'Bayazid', 'Chandgaon', 'Panchlaish', 'Khulshi', 'Bakalia', 'Akbarshah'],
  Khulna: ['Kotwali', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Batiaghata', 'Dumuria', 'Phultala', 'Rupsa', 'Terokhada'],
  Rajshahi: ['Boalia', 'Rajpara', 'Motihar', 'Shahmakhdum', 'Paba', 'Godagari', 'Tanore', 'Bagha', 'Charghat', 'Durgapur'],
  Sylhet: ['Sylhet Sadar', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Fenchuganj', 'Golapganj', 'Jaintiapur', 'Kanaighat', 'Zakiganj'],
  Barisal: ['Barisal Sadar', 'Bakerganj', 'Babuganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
  Rangpur: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
  Mymensingh: ['Mymensingh Sadar', 'Bhaluka', 'Trishal', 'Haluaghat', 'Muktagachha', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Ishwarganj'],
  Gazipur: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
  Narayanganj: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],
  Comilla: ['Comilla Sadar', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam'],
  CoxsBazar: ['Cox\'s Bazar Sadar', 'Chakaria', 'Kutubdia', 'Maheshkhali', 'Ramu', 'Teknaf', 'Ukhia', 'Pekua'],
  Bogra: ['Bogra Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur'],
  Jessore: ['Jessore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
};

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed districts
  const districtMap = new Map<string, District>();
  let districtOrder = 1;

  for (const [division, districts] of Object.entries(divisions)) {
    for (const districtName of districts) {
      const existing = await prisma.district.findFirst({
        where: { nameEn: districtName },
      });

      if (!existing) {
        const created = await prisma.district.create({
          data: {
            nameEn: districtName,
            nameBn: districtName, // Would be localized in production
            division,
          },
        });
        districtMap.set(districtName, created);
        console.log(`  ✓ District: ${districtName}`);
      } else {
        districtMap.set(districtName, existing);
      }
      districtOrder++;
    }
  }

  // Seed sub-districts
  for (const [districtName, subDistricts] of Object.entries(subDistrictSamples)) {
    const district = districtMap.get(districtName);
    if (!district) continue;

    for (const subName of subDistricts) {
      const existing = await prisma.subDistrict.findFirst({
        where: { districtId: district.id, nameEn: subName },
      });

      if (!existing) {
        await prisma.subDistrict.create({
          data: {
            districtId: district.id,
            nameEn: subName,
            nameBn: subName,
          },
        });
      }
    }
    console.log(`  ✓ Sub-districts for ${districtName}: ${subDistricts.length}`);
  }

  // Create system user for automated actions
  const systemUser = await prisma.user.upsert({
    where: { phoneNumber: '+8800000000000' },
    update: {},
    create: {
      phoneNumber: '+8800000000000',
      phoneVerified: true,
      isActive: true,
      profile: {
        create: {
          legalName: 'Bondhu System',
          displayName: 'Bondhu',
          handle: 'bondhu_system',
          bio: 'Official system account for Bondhu platform',
        },
      },
    },
  });
  console.log(`  ✓ System user: ${systemUser.id}`);

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
