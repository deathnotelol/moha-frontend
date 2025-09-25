import { motion } from "framer-motion"; // ✅ animation
import { ArrowUpRight } from "lucide-react";

const highlights = [
  {
    id: 1,
    icon: (
      <img
        src="images/mpf_logo.png"
        className="h-16 w-16 object-contain"
        alt="logoimage"
      />
    ),
    title: "မြန်မာနိုင်ငံရဲတပ်ဖွဲ့",
    text: "ပြည်တွင်းလုံခြုံရေး၊ တရားဥပဒေစိုးမိုးရေး၊ မူးယစ်ဆေးဝါးအန္တရာယ်တားဆီးကာကွယ်ရေး...",
    link: "https://policeforce.gov.mm/",
  },
  {
    id: 2,
    icon: (
      <img
        src="images/gad_logo.jpg"
        className="h-16 w-16 object-contain"
        alt="logoimage"
      />
    ),
    title: "အထွေထွေအုပ်ချုပ်ရေးဦးစီးဌာန",
    text: "တရားဥပဒေစိုးမိုးရေး၊ ရပ်ရွာအေးချမ်းသာယာရေး၊ ဒေသဖွံ့ဖြိုးရေး....",
    link: "https://gad.gov.mm/",
  },
  {
    id: 3,
    icon: (
      <img
        src="images/bsi_logo.jpg"
        className="h-16 w-16 object-contain"
        alt="logoimage"
      />
    ),
    title: "အထူးစုံစမ်းစစ်ဆေးရေးဦးစီးဌာန",
    text: "ဖြစ်ရပ်မှန်ပေါ်ပေါက်အောင် စုံစမ်းဖော်ထုတ်၍ တာဝန်ရှိသူများအား ပြစ်မှုကြောင်းအရလည်းကောင်း....",
    link: "https://www.bsi.gov.mm",
  },
  {
    id: 4,
    icon: (
      <img
        src="images/pd_logo.png"
        className="h-16 w-16 object-contain"
        alt="logoimage"
      />
    ),
    title: "အကျဉ်းဦးစီးဌာန",
    text: "လုံခြုံစွာထိန်းသိမ်းရေး၊ အကျင့် စာရိတ္တပြုပြင်ပြောင်းလဲရေး၊ ကုထုတ်လုပ်မှုလုပ်ငန်းများ လေ့ကျင့်သင်ကြားရေး...",
    link: "https://prisonsdepartment.gov.mm/",
  },
  {
    id: 5,
    icon: (
      <img
        src="images/fsd_logo.png"
        className="h-16 w-16 object-contain"
        alt="logoimage"
      />
    ),
    title: "မီးသတ်ဦးစီးဌာန",
    text: "မီးသတ်ဦးစီးဌာနသည် ပြည်သူလူထု၏ အသက်အိုးအိမ်ပစ္စည်းများ၊ နိုင်ငံတော်အတွင်းရှိကုန်ထုတ်အရင်းအနှီးများကို မီးဘေးအန္တရာယ်မှ...",
    link: "https://www.fsd.gov.mm",
  },
];

export default function Highlights() {
  return (
    <section
      className="relative py-20 bg-cover bg-center"
      style={{
        backgroundColor: "#1A3B66",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* content */}
      <div className="relative max-w-6xl mx-auto text-center text-white">
        {/* Title */}
        <h2 className="relative text-3xl md:text-4xl font-extrabold mb-6 text-white tracking-wide">
          <span className="bg-gradient-to-r from-blue-600 via-yellow-500 to-green-500 bg-clip-text text-transparent p-3">
            ပြည်ထဲရေးဝန်ကြီးဌာန
          </span>
          <span className="block w-36 h-1 mt-5 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
        </h2>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 italic drop-shadow-md animate-fadeIn mb-6 md:leading-[34px]">
          နိုင်ငံတော်လုံခြုံရေး၊ တရားဥပဒေစိုးမိုးရေး၊ ရပ်ရွာအေးချမ်းသာယာရေး၊
          <br className="hidden md:block" />
          ပြည်သူ့အကျိုးပြုဆောင်ရွက်ရေး ဟူသော ရည်မှန်းချက်တာဝန်များကို
          အကောင်အထည်ဖော် ဆောင်ရွက်လျက်ရှိပါသည်။
        </p>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {highlights.map((item) => (
            <motion.a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-gray-800 flex flex-col items-center hover:shadow-2xl transition"
            >
              {/* icon */}
              <div className="flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 shadow-md group-hover:scale-110 transition">
                {item.icon}
              </div>

              {/* title */}
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-700 transition">
                {item.title}
              </h3>

              {/* text */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {item.text}
              </p>

              {/* button */}
              <span className="inline-flex items-center gap-1 text-blue-600 font-medium group-hover:underline">
                Learn More
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
