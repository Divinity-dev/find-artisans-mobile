import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const testimonials = [
  {
    id: 1,
    type: "Customer",
    name: "Chinedu O.",
    location: "Lagos",
    image: require("../assets/images/worker3.jpeg"),
    message:
      "I found a verified plumber within 15 minutes. The service was excellent and affordable.",
    rating: 5,
  },
  {
    id: 2,
    type: "Worker",
    name: "Aisha M.",
    location: "Abuja",
    image: require("../assets/images/worker1.jpeg"),
    message:
      "Since joining FindArtisans, I've gained more customers than ever before.",
    rating: 5,
  },
  {
    id: 3,
    type: "Customer",
    name: "David E.",
    location: "Port Harcourt",
    image: require("../assets/images/worker2.jpeg"),
    message:
      "The ratings and verification gave me confidence. My electrician did a fantastic job.",
    rating: 5,
  },
  {
    id: 4,
    type: "Worker",
    name: "Blessing K.",
    location: "Benin",
    image: require("../assets/images/electrician.jpeg"),
    message:
      "FindArtisans has helped me grow my business and reach more clients.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((previous) =>
        previous === testimonials.length - 1
          ? 0
          : previous + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[current];

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          REAL EXPERIENCES
        </Text>

        <Text style={styles.title}>
          People are finding their people.
        </Text>

        <Text style={styles.subtitle}>
          Hear from customers and artisans using FindArtisans.
        </Text>
      </View>

      <View style={styles.card}>

        <Text style={styles.quoteIcon}>
          “
        </Text>

        <Text style={styles.message}>
          {testimonial.message}
        </Text>

        <View style={styles.stars}>
          {Array.from({
            length: testimonial.rating,
          }).map((_, index) => (
            <Text key={index} style={styles.star}>
              ★
            </Text>
          ))}
        </View>

        <View style={styles.person}>

          <Image
            source={testimonial.image}
            style={styles.avatar}
          />

          <View style={styles.personInfo}>
            <Text style={styles.name}>
              {testimonial.name}
            </Text>

            <Text style={styles.location}>
              {testimonial.type} • {testimonial.location}
            </Text>
          </View>

        </View>

      </View>

      <View style={styles.dots}>
        {testimonials.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setCurrent(index)}
            style={[
              styles.dot,
              index === current && styles.activeDot,
            ]}
          />
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 70,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  eyebrow: {
    color: "#f97316",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    color: "#ffffff",
    fontSize: 29,
    lineHeight: 37,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 12,
  },

  card: {
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 24,
    padding: 25,
  },

  quoteIcon: {
    color: "#f97316",
    fontSize: 55,
    lineHeight: 55,
    fontWeight: "900",
  },

  message: {
    color: "#d1d5db",
    fontSize: 18,
    lineHeight: 29,
    fontStyle: "italic",
  },

  stars: {
    flexDirection: "row",
    marginTop: 20,
  },

  star: {
    color: "#facc15",
    fontSize: 18,
    marginRight: 3,
  },

  person: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  personInfo: {
    marginLeft: 15,
  },

  name: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  location: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    gap: 7,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#374151",
  },

  activeDot: {
    width: 28,
    backgroundColor: "#f97316",
  },
});

export default Testimonials;