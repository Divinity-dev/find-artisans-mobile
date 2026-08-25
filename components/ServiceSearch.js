import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SERVICES = [
  {
    name: "Plumber",
    icon: "🔧",
  },
  {
    name: "Electrician",
    icon: "⚡",
  },
  {
    name: "Hairdresser",
    icon: "💇",
  },
  {
    name: "Mechanic",
    icon: "🔧",
  },
  {
    name: "Carpenter",
    icon: "🪚",
  },
  {
    name: "Painter",
    icon: "🎨",
  },
  {
    name: "Welder",
    icon: "⚒️",
  },
  {
    name: "Cleaner",
    icon: "🧹",
  },
  {
    name: "Tiler",
    icon: "🧱",
  },
  {
    name: "Bricklayer",
    icon: "🧱",
  },
];

const ServiceSearch = ({ value = "", onServiceChange }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleToggleSuggestions = () => {
  setShowSuggestions((current) => !current);
};

  // Filter suggestions based on what the user is typing.
  const suggestions = useMemo(() => {
    if (!value.trim()) {
      return SERVICES;
    }

    const searchText = value.trim().toLowerCase();

    return SERVICES.filter((service) =>
      service.name.toLowerCase().includes(searchText)
    );
  }, [value]);

  const handleChange = (text) => {
    onServiceChange?.(text);

    // Keep suggestions open while typing.
    setShowSuggestions(true);
  };

  const handleSuggestionPress = (service) => {
    onServiceChange?.(service.name);

    // Close suggestions after selecting a service.
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onServiceChange?.("");

    // Keep suggestions open after clearing.
    setShowSuggestions(true);
  };

  return (
    <View style={styles.container}>

      {/* Search input */}
      <View style={styles.inputContainer}>

        <Text style={styles.inputIcon}>
          🔍
        </Text>

        <TextInput
          value={value}
          onChangeText={handleChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="What service do you need?"
          placeholderTextColor="#6b7280"
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
        />

        {/* Clear button */}
        {value.length > 0 && (
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>
              ×
            </Text>
          </Pressable>
        )}

      </View>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>

          <View style={styles.suggestionsHeader}>
  <Text style={styles.suggestionsTitle}>
    {value.trim()
      ? "Suggested services"
      : "Popular services"}
  </Text>

  <Pressable
    onPress={handleToggleSuggestions}
    style={styles.collapseButton}
  >
    <Text style={styles.collapseIcon}>
      ˄
    </Text>
  </Pressable>
</View>

          {suggestions.map((service) => (
            <Pressable
              key={service.name}
              onPress={() => handleSuggestionPress(service)}
              style={styles.suggestion}
            >

              <View style={styles.serviceIcon}>
                <Text style={styles.serviceIconText}>
                  {service.icon}
                </Text>
              </View>

              <Text style={styles.serviceName}>
                {service.name}
              </Text>

              <Text style={styles.suggestionArrow}>
                ›
              </Text>

            </Pressable>
          ))}

        </View>
      )}

      {/* No matching suggestion */}
      {showSuggestions &&
        value.trim() &&
        suggestions.length === 0 && (
          <View style={styles.noResults}>

            <Text style={styles.noResultsText}>
              No suggested service found.
            </Text>

            <Text style={styles.noResultsSubtext}>
              You can still search for "{value}".
            </Text>

          </View>
        )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

 inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ffffff",
  borderRadius: 14,
  paddingHorizontal: 14,
  minHeight: 54,
  borderWidth: 0,
  borderColor: "transparent",
},

  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    paddingVertical: 14,
  },

  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },

  clearText: {
    color: "#6b7280",
    fontSize: 22,
    lineHeight: 23,
    fontWeight: "400",
  },

  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
  },

 suggestionsTitle: {
  color: "#6b7280",
  fontSize: 12,
  fontWeight: "700",
},

  suggestion: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  serviceIconText: {
    fontSize: 17,
  },

  serviceName: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },

  suggestionArrow: {
    color: "#9ca3af",
    fontSize: 24,
    fontWeight: "300",
  },

  noResults: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },

  noResultsText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },

  noResultsSubtext: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },

  suggestionsHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginHorizontal: 6,
  marginBottom: 6,
},

collapseButton: {
  width: 30,
  height: 30,
  borderRadius: 15,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f3f4f6",
},

collapseIcon: {
  color: "#6b7280",
  fontSize: 18,
  fontWeight: "700",
},
});

export default ServiceSearch;