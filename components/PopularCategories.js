import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  {
    title: "Electricians",
    icon: "⚡",
    description: "Electrical installations, repairs and maintenance.",
  },
  {
    title: "Plumbers",
    icon: "🔧",
    description: "Reliable plumbing installation and repairs.",
  },
  {
    title: "Carpenters",
    icon: "🔨",
    description: "Furniture, woodwork and custom carpentry.",
  },
  {
    title: "Painters",
    icon: "🎨",
    description: "Interior, exterior and decorative painting.",
  },
  {
    title: "Cleaners",
    icon: "🧹",
    description: "Professional home and office cleaning services.",
  },
  {
    title: "Mechanics",
    icon: "🚗",
    description: "Vehicle repairs, servicing and diagnostics.",
  },
];

const PopularCategories = ({ onCategoryPress, onViewAll }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.eyebrow}>
        EXPLORE SERVICES
      </Text>

      <Text style={styles.title}>
        What kind of artisan do you need?
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onViewAll}
        style={styles.viewAll}
      >
        <Text style={styles.viewAllText}>
          View all workers →
        </Text>
      </TouchableOpacity>

      <View style={styles.categories}>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.title}
            activeOpacity={0.8}
            style={styles.card}
            onPress={() =>
              onCategoryPress(category.title)
            }
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                {category.icon}
              </Text>
            </View>

            <Text style={styles.categoryTitle}>
              {category.title}
            </Text>

            <Text style={styles.description}>
              {category.description}
            </Text>
          </TouchableOpacity>
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
    marginTop: 10,
  },

  viewAll: {
    alignSelf: "flex-start",
    marginTop: 15,
  },

  viewAllText: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "700",
  },

  categories: {
    marginTop: 25,
  },

  card: {
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 22,
  },

  categoryTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 15,
  },

  description: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
});

export default PopularCategories;