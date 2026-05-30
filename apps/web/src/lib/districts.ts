export interface District {
  id: number;
  nameEn: string;
  nameBn: string;
  division: string;
}

export const districts: District[] = [
  // Barisal Division (6)
  { id: 1, nameEn: 'Barguna', nameBn: 'বরগুনা', division: 'Barisal' },
  { id: 2, nameEn: 'Barisal', nameBn: 'বরিশাল', division: 'Barisal' },
  { id: 3, nameEn: 'Bhola', nameBn: 'ভোলা', division: 'Barisal' },
  { id: 4, nameEn: 'Jhalokati', nameBn: 'ঝালকাঠি', division: 'Barisal' },
  { id: 5, nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', division: 'Barisal' },
  { id: 6, nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', division: 'Barisal' },
  // Chittagong Division (11)
  { id: 7, nameEn: 'Bandarban', nameBn: 'বান্দরবান', division: 'Chittagong' },
  { id: 8, nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', division: 'Chittagong' },
  { id: 9, nameEn: 'Chandpur', nameBn: 'চাঁদপুর', division: 'Chittagong' },
  { id: 10, nameEn: 'Chittagong', nameBn: 'চট্টগ্রাম', division: 'Chittagong' },
  { id: 11, nameEn: 'Comilla', nameBn: 'কুমিল্লা', division: 'Chittagong' },
  { id: 12, nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার', division: 'Chittagong' },
  { id: 13, nameEn: 'Feni', nameBn: 'ফেনী', division: 'Chittagong' },
  { id: 14, nameEn: 'Khagrachari', nameBn: 'খাগড়াছড়ি', division: 'Chittagong' },
  { id: 15, nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', division: 'Chittagong' },
  { id: 16, nameEn: 'Noakhali', nameBn: 'নোয়াখালী', division: 'Chittagong' },
  { id: 17, nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', division: 'Chittagong' },
  // Dhaka Division (13)
  { id: 18, nameEn: 'Dhaka', nameBn: 'ঢাকা', division: 'Dhaka' },
  { id: 19, nameEn: 'Faridpur', nameBn: 'ফরিদপুর', division: 'Dhaka' },
  { id: 20, nameEn: 'Gazipur', nameBn: 'গাজীপুর', division: 'Dhaka' },
  { id: 21, nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', division: 'Dhaka' },
  { id: 22, nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', division: 'Dhaka' },
  { id: 23, nameEn: 'Madaripur', nameBn: 'মাদারীপুর', division: 'Dhaka' },
  { id: 24, nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', division: 'Dhaka' },
  { id: 25, nameEn: 'Munshiganj', nameBn: 'মুন্সিগঞ্জ', division: 'Dhaka' },
  { id: 26, nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', division: 'Dhaka' },
  { id: 27, nameEn: 'Narsingdi', nameBn: 'নরসিংদী', division: 'Dhaka' },
  { id: 28, nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', division: 'Dhaka' },
  { id: 29, nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', division: 'Dhaka' },
  { id: 30, nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', division: 'Dhaka' },
  // Khulna Division (10)
  { id: 31, nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', division: 'Khulna' },
  { id: 32, nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', division: 'Khulna' },
  { id: 33, nameEn: 'Jessore', nameBn: 'যশোর', division: 'Khulna' },
  { id: 34, nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', division: 'Khulna' },
  { id: 35, nameEn: 'Khulna', nameBn: 'খুলনা', division: 'Khulna' },
  { id: 36, nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', division: 'Khulna' },
  { id: 37, nameEn: 'Magura', nameBn: 'মাগুরা', division: 'Khulna' },
  { id: 38, nameEn: 'Meherpur', nameBn: 'মেহেরপুর', division: 'Khulna' },
  { id: 39, nameEn: 'Narail', nameBn: 'নড়াইল', division: 'Khulna' },
  { id: 40, nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', division: 'Khulna' },
  // Mymensingh Division (4)
  { id: 41, nameEn: 'Jamalpur', nameBn: 'জামালপুর', division: 'Mymensingh' },
  { id: 42, nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', division: 'Mymensingh' },
  { id: 43, nameEn: 'Netrokona', nameBn: 'নেত্রকোনা', division: 'Mymensingh' },
  { id: 44, nameEn: 'Sherpur', nameBn: 'শেরপুর', division: 'Mymensingh' },
  // Rajshahi Division (8)
  { id: 45, nameEn: 'Bogra', nameBn: 'বগুড়া', division: 'Rajshahi' },
  { id: 46, nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi' },
  { id: 47, nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', division: 'Rajshahi' },
  { id: 48, nameEn: 'Naogaon', nameBn: 'নওগাঁ', division: 'Rajshahi' },
  { id: 49, nameEn: 'Natore', nameBn: 'নাটোর', division: 'Rajshahi' },
  { id: 50, nameEn: 'Pabna', nameBn: 'পাবনা', division: 'Rajshahi' },
  { id: 51, nameEn: 'Rajshahi', nameBn: 'রাজশাহী', division: 'Rajshahi' },
  { id: 52, nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', division: 'Rajshahi' },
  // Rangpur Division (8)
  { id: 53, nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', division: 'Rangpur' },
  { id: 54, nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', division: 'Rangpur' },
  { id: 55, nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', division: 'Rangpur' },
  { id: 56, nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', division: 'Rangpur' },
  { id: 57, nameEn: 'Nilphamari', nameBn: 'নীলফামারী', division: 'Rangpur' },
  { id: 58, nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', division: 'Rangpur' },
  { id: 59, nameEn: 'Rangpur', nameBn: 'রংপুর', division: 'Rangpur' },
  { id: 60, nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', division: 'Rangpur' },
  // Sylhet Division (4)
  { id: 61, nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', division: 'Sylhet' },
  { id: 62, nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', division: 'Sylhet' },
  { id: 63, nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', division: 'Sylhet' },
  { id: 64, nameEn: 'Sylhet', nameBn: 'সিলেট', division: 'Sylhet' },
];

export const districtOptions = districts.map((d) => ({
  value: d.id.toString(),
  label: `${d.nameBn} (${d.nameEn})`,
}));

export function getDistrictById(id: number | string): District | undefined {
  return districts.find((d) => d.id === Number(id));
}
