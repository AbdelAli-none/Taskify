import Image from "next/image";
import { motion } from "framer-motion";

interface ImageSectionProps {
  src: string;
  alt: string;
  paragraph: string;
}

export const ImageSection = ({ src, alt, paragraph }: ImageSectionProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -600 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.8 }}
      className="overflow-hidden w-full h-full text-center"
    >
      <div className="flex flex-col justify-center items-center">
        <Image
          src={`/${src}`}
          alt={alt}
          width={250}
          height={250}
          // className="block"
        ></Image>
        <p className="text-gray-500 dark:text-gray-400">{paragraph}</p>
      </div>
    </motion.div>
  );
};
