'use client';

import { TrendUp, Users, Briefcase, Sparkles } from 'lucide-react';

const trendingTags = [
  { tag: '#ঈদ_মোবারক', posts: '১২.৫k পোস্ট', category: 'উৎসব' },
  { tag: '#বাংলাদেশ_ক্রিকেট', posts: '৮.২k পোস্ট', category: 'খেলা' },
  { tag: '#পদ্মা_সেতু', posts: '৫.১k পোস্ট', category: 'জাতীয়' },
  { tag: '#ডিজিটাল_বাংলাদেশ', posts: '৩.৮k পোস্ট', category: 'টেক' },
  { tag: '#বৃষ্টির_দিন', posts: '২.৯k পোস্ট', category: 'প্রকৃতি' },
];

const suggestedUsers = [
  { name: 'তাসনিম জাহান', handle: '@tasnim', initials: 'ত' },
  { name: 'রাহুল দাস', handle: '@rahul', initials: 'র' },
  { name: 'ফারিয়া আক্তার', handle: '@faria', initials: 'ফ' },
];

export function TrendingSidebar() {
  return (
    <div className="space-y-4">
      {/* Trending Topics */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendUp className="w-4 h-4 text-[#5B21B6]" />
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">ট্রেন্ডিং</h3>
        </div>
        <div className="space-y-3">
          {trendingTags.map((item, i) => (
            <div key={i} className="flex items-center justify-between group cursor-pointer">
              <div>
                <span className="text-[13px] text-[#5B21B6] font-semibold group-hover:underline">{item.tag}</span>
                <p className="text-[10px] text-[#6B5E8A] font-medium">{item.posts}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#6B5E8A] font-medium">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-[#0D9488]" />
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">অনুসরণ করুন</h3>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((user, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] flex items-center justify-center text-[#5B21B6] text-xs font-bold font-bangla">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#0F0A1E] truncate font-bangla">{user.name}</p>
                <p className="text-[10px] text-[#6B5E8A]">{user.handle}</p>
              </div>
              <button className="text-[10px] px-3 py-1 rounded-full bg-[#EDE9FF] text-[#5B21B6] font-bold hover:bg-[#5B21B6] hover:text-white transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs CTA */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-[#5B21B6]" />
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">চাকরি খুঁজুন</h3>
        </div>
        <p className="text-[11px] text-[#6B5E8A] mb-3 font-bangla">আপনার স্বপ্নের চাকরি খুঁজে পান আজই</p>
        <button className="w-full py-2 rounded-xl text-xs font-bold text-white bondhu-gradient shadow-md hover:shadow-lg transition-all active:scale-95">
          চাকরি পোর্টাল
        </button>
      </div>

      {/* Footer */}
      <div className="text-[10px] text-[#9B8FC0] text-center leading-relaxed px-2">
        <span className="font-medium">Bondhu</span> — বন্ধুত্বের নতুন মাত্রা
        <br />
        <span className="text-[9px]">© ২০২৫ বন্ধু অ্যাপ</span>
      </div>
    </div>
  );
}
