import MarqueeStrip from '@/components/ui/MarqueeStrip';

// Two thin marquees — celebratory taglines that reinforce the brand
// without taking real estate from the rest of the page.

export default function MarqueeStrips() {
  return (
    <section className="relative">
      <MarqueeStrip
        items={[
          'Slow-dum biryani',
          '#1 on Zomato · Deoghar',
          'Themed cage booths',
          'Veg & Non-Veg',
          'Multicuisine',
          'Open 12 PM – 11 PM',
          'Bulk orders welcome',
          'Since 2021',
        ]}
      />
    </section>
  );
}
