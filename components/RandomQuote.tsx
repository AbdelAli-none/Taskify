import { Quote } from "lucide-react";


const RandomQuote = () => {
  return (
    <div className="h-full w-full flex text-center items-end space-x-3 justify-center">
      <Quote className="w-6 h-6 text-white/50 mb-2" />
      <p className="text-white text-sm font-medium leading-relaxed italic">
        &quot;The secret of getting ahead is getting started.&quot;
      </p>
      <p className="text-white/70 text-xs mt-2 text-right">— Mark Twain</p>
    </div>
  );
};

export default RandomQuote;
