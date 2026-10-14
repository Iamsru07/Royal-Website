export interface PublicReview {
  id: string;
  authorName: string;
  city: string;
  avatarBg: string;
  platform: 'Google Reviews' | 'Zomato Gold' | 'TripAdvisor' | 'Dineout' | 'Verified Diner';
  rating: number; // 4 or 5
  diningDate: string;
  title: string;
  comment: string;
  recommendedDishes: string[];
  occasion: string;
  helpfulCount: number;
  isVerifiedDiner: boolean;
  tableNumber?: string;
  diningZone?: string;
}

export const INITIAL_PUBLIC_REVIEWS: PublicReview[] = [
  {
    id: 'pub-rev-1',
    authorName: 'Aarav & Meera Mehta',
    city: 'Bandra, Mumbai',
    avatarBg: 'bg-amber-100 text-amber-900',
    platform: 'Google Reviews',
    rating: 5,
    diningDate: 'Yesterday',
    title: 'Spectacular Smoked Paneer Tikka & Instant QR Ordering!',
    comment:
      'We pre-booked Table 12 in the AC Family Lounge. The table was prepared 30 minutes in advance with welcoming ambiance. The Paneer Tikka was smoky and melt-in-mouth, and the Dal Makhani is hands down the best in the city. Re-ordering hot rotis via the table QR took just seconds!',
    recommendedDishes: ['Paneer Tikka', 'Dal Makhani', 'Butter Garlic Naan'],
    occasion: 'Family Dinner',
    helpfulCount: 47,
    isVerifiedDiner: true,
    tableNumber: '12',
    diningZone: 'Royal AC Family Lounge',
  },
  {
    id: 'pub-rev-2',
    authorName: 'Dr. Priya Sharma',
    city: 'South Extension, Delhi',
    avatarBg: 'bg-purple-100 text-purple-900',
    platform: 'Zomato Gold',
    rating: 5,
    diningDate: '3 days ago',
    title: 'Dreamy Candlelight Anniversary on the Rooftop Star Deck',
    comment:
      'Celebrated our 6th wedding anniversary on Table 16 at the Rooftop Star Deck. Mild retro jazz music, gentle breeze, and impeccable hospitality. The Mutton Dum Biryani was fragrant with saffron, and the Gulab Jamun with chilled Rabri was pure nostalgia.',
    recommendedDishes: ['Mutton Dum Biryani', 'Gulab Jamun with Rabri', 'Tandoori Murgh'],
    occasion: 'Anniversary Celebration',
    helpfulCount: 62,
    isVerifiedDiner: true,
    tableNumber: '16',
    diningZone: 'Rooftop Star Deck · VIP',
  },
  {
    id: 'pub-rev-3',
    authorName: 'Vikram Malhotra',
    city: 'Indiranagar, Bengaluru',
    avatarBg: 'bg-emerald-100 text-emerald-900',
    platform: 'Google Reviews',
    rating: 5,
    diningDate: 'Sep 25, 2026',
    title: '24-Hour Slow Cooked Dal Makhani that beats Bukhara!',
    comment:
      'I am extremely picky about Mughlai and Awadhi cuisine. Royal Taste honors authentic slow-roasting techniques. The garlic naan was wafer-thin yet fluffy, and the chicken tikka had zero artificial food color. Cleanliness 10/10.',
    recommendedDishes: ['Dal Makhani', 'Garlic Naan', 'Chicken Tikka Masala'],
    occasion: 'Business Lunch',
    helpfulCount: 31,
    isVerifiedDiner: true,
    tableNumber: '04',
    diningZone: 'Ground Floor Heritage Bistro',
  },
  {
    id: 'pub-rev-4',
    authorName: 'Ananya Deshmukh',
    city: 'Koregaon Park, Pune',
    avatarBg: 'bg-rose-100 text-rose-900',
    platform: 'TripAdvisor',
    rating: 5,
    diningDate: 'Sep 22, 2026',
    title: 'Flawless Pre-booking & Warm Staff Attentiveness',
    comment:
      'Booking online with the ₹99 deposit gave us total peace of mind on a crowded Saturday night. When our cab arrived, the host already had our table cleaned and ready. Outstanding customer care and virgin mojitos!',
    recommendedDishes: ['Crispy Corn Chaat', 'Virgin Mojito', 'Paneer Lababdar'],
    occasion: 'Weekend Get-Together',
    helpfulCount: 29,
    isVerifiedDiner: true,
    tableNumber: '08',
    diningZone: 'Window Garden View',
  },
  {
    id: 'pub-rev-5',
    authorName: 'Chef Rajesh Singhania',
    city: 'Hazratganj, Lucknow',
    avatarBg: 'bg-blue-100 text-blue-900',
    platform: 'Dineout',
    rating: 5,
    diningDate: 'Sep 18, 2026',
    title: 'Rare culinary consistency with zero shortcuts',
    comment:
      'Being in the restaurant fraternity myself, I checked their open kitchen standards. Pure desi ghee, freshly ground garam masalas, and pristine copper cutlery. The Shahi Tukda with pistachio crumble was unforgettable.',
    recommendedDishes: ['Hyderabadi Dum Biryani', 'Shahi Tukda', 'Tandoori Roti'],
    occasion: 'Solo Culinary Exploration',
    helpfulCount: 54,
    isVerifiedDiner: true,
    tableNumber: '02',
    diningZone: 'Ground Floor Heritage Bistro',
  },
  {
    id: 'pub-rev-6',
    authorName: 'Kabir & Sanya Roy',
    city: 'Alipore, Kolkata',
    avatarBg: 'bg-teal-100 text-teal-900',
    platform: 'Google Reviews',
    rating: 5,
    diningDate: 'Sep 15, 2026',
    title: 'Superb Veg & Non-Veg Separation. 100% Family Friendly!',
    comment:
      'My in-laws are strictly vegetarian while my husband and I love tandoori chicken. The staff ensured separate platters and dedicated tongs with zero mix-up. Loved the garden seating atmosphere.',
    recommendedDishes: ['Paneer Tikka Platter', 'Murgh Malai Tikka', 'Subz Biryani'],
    occasion: 'Family Dinner',
    helpfulCount: 39,
    isVerifiedDiner: true,
    tableNumber: '09',
    diningZone: 'Window Garden View',
  },
  {
    id: 'pub-rev-7',
    authorName: 'Nikhil Verma',
    city: 'Jubilee Hills, Hyderabad',
    avatarBg: 'bg-indigo-100 text-indigo-900',
    platform: 'Zomato Gold',
    rating: 5,
    diningDate: 'Sep 12, 2026',
    title: 'The Dum Biryani aroma hit us before we even sat down!',
    comment:
      'Long-grain aged basmati rice cooked on sealed handi with whole spices and tender meat. No grease, no heaviness. Served with chilled burani raita and mirchi ka salan. 5 stars without hesitation.',
    recommendedDishes: ['Royal Mutton Biryani', 'Burani Raita', 'Phirni'],
    occasion: 'Dinner with Friends',
    helpfulCount: 41,
    isVerifiedDiner: true,
    tableNumber: '14',
    diningZone: 'Rooftop Star Deck · VIP',
  },
  {
    id: 'pub-rev-8',
    authorName: 'Ritu & Manav Kapoor',
    city: 'Civil Lines, Jaipur',
    avatarBg: 'bg-amber-100 text-amber-900',
    platform: 'Google Reviews',
    rating: 4,
    diningDate: 'Sep 08, 2026',
    title: 'Great food, fast service even during peak Sunday rush',
    comment:
      'Even though there was a 20-minute waiting line for walk-ins, our advance table pre-booking let us walk right in. Crispy corn and paneer butter masala were delicious. Highly recommend reserving in advance!',
    recommendedDishes: ['Paneer Butter Masala', 'Crispy Corn Chaat', 'Laccha Paratha'],
    occasion: 'Sunday Lunch',
    helpfulCount: 22,
    isVerifiedDiner: true,
    tableNumber: '11',
    diningZone: 'Royal AC Family Lounge',
  },
  {
    id: 'pub-rev-9',
    authorName: 'Harsh Vardhan',
    city: 'Bhopal, MP',
    avatarBg: 'bg-neutral-100 text-neutral-900',
    platform: 'TripAdvisor',
    rating: 5,
    diningDate: 'Aug 29, 2026',
    title: 'Outstanding hospitality, royal taste lives up to its name',
    comment:
      'Attended a corporate team celebration here with 14 colleagues. Bill splitting was painless, food came out hot and synchronized, and the mocktail refills were swift. Top tier management.',
    recommendedDishes: ['Chicken Tikka', 'Paneer Tikka', 'Dal Makhani', 'Brownie with Ice Cream'],
    occasion: 'Corporate Team Dinner',
    helpfulCount: 35,
    isVerifiedDiner: true,
    tableNumber: '10',
    diningZone: 'Royal AC Family Lounge',
  },
];
