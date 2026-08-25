import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { State, City } from "country-state-city";
import { lgas } from "nigerian-states-and-lgas";

const LocationSelector = ({
  selectedLocation = {},
  onLocationChange,
}) => {
  // ==========================================================
  // MAIN LOCATION MODAL
  // ==========================================================

  const [visible, setVisible] = useState(false);

  // ==========================================================
  // CURRENT SELECTION
  // ==========================================================

  const [selectedState, setSelectedState] = useState(
    selectedLocation.state || ""
  );

  const [selectedCity, setSelectedCity] = useState(
    selectedLocation.city || ""
  );

  const [selectedLGA, setSelectedLGA] = useState(
    selectedLocation.lga || ""
  );

  // ==========================================================
  // ACTIVE PICKER
  // ==========================================================
  // null  = no picker open
  // state = state picker open
  // city  = city picker open
  // lga   = LGA picker open

  const [activePicker, setActivePicker] = useState(null);

  // ==========================================================
  // NIGERIAN STATES
  // ==========================================================

  const nigeriaStates = useMemo(() => {
    return State.getStatesOfCountry("NG");
  }, []);

  // ==========================================================
  // CITIES
  // ==========================================================

  const cities = useMemo(() => {
    if (!selectedState) {
      return [];
    }

    const state = nigeriaStates.find(
      (item) => item.name === selectedState
    );

    if (!state) {
      return [];
    }

    return City.getCitiesOfState(
      "NG",
      state.isoCode
    );
  }, [selectedState, nigeriaStates]);

  // ==========================================================
  // LOCAL GOVERNMENTS
  // ==========================================================

  const localGovernments = useMemo(() => {
    if (!selectedState) {
      return [];
    }

    return lgas(selectedState) || [];
  }, [selectedState]);

  // ==========================================================
  // OPEN LOCATION SELECTOR
  // ==========================================================

  const openSelector = () => {
    setSelectedState(selectedLocation.state || "");
    setSelectedCity(selectedLocation.city || "");
    setSelectedLGA(selectedLocation.lga || "");

    setActivePicker(null);
    setVisible(true);
  };

  // ==========================================================
  // CLOSE LOCATION SELECTOR
  // ==========================================================

  const closeSelector = () => {
    setActivePicker(null);
    setVisible(false);
  };

  // ==========================================================
  // CLOSE PICKER
  // ==========================================================

  const closePicker = () => {
    setActivePicker(null);
  };

  // ==========================================================
  // SELECT STATE
  // ==========================================================

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);

    // Changing state invalidates city and LGA.
    setSelectedCity("");
    setSelectedLGA("");

    closePicker();
  };

  // ==========================================================
  // SELECT CITY
  // ==========================================================

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);

    // Changing city clears the previous LGA.
    setSelectedLGA("");

    closePicker();
  };

  // ==========================================================
  // SELECT LGA
  // ==========================================================

  const handleLGASelect = (lgaName) => {
    setSelectedLGA(lgaName);

    closePicker();
  };

  // ==========================================================
  // APPLY LOCATION
  // ==========================================================

  const handleApply = () => {
    const location = {
      state: selectedState,
      city: selectedCity,
      lga: selectedLGA,
    };

    onLocationChange?.(location);

    setActivePicker(null);
    setVisible(false);
  };

  // ==========================================================
  // DISPLAY LOCATION
  // ==========================================================

  const locationText = [
    selectedLocation.city,
    selectedLocation.state,
  ]
    .filter(Boolean)
    .join(", ");

  const hasLocation = Boolean(
    selectedLocation.state ||
      selectedLocation.city ||
      selectedLocation.lga
  );

  // ==========================================================
  // PICKER DATA
  // ==========================================================

  const pickerTitle =
    activePicker === "state"
      ? "Select State"
      : activePicker === "city"
      ? "Select City"
      : "Select Local Government Area";

  const pickerOptions =
    activePicker === "state"
      ? nigeriaStates.map((state) => ({
          label: state.name,
          value: state.name,
          key: state.isoCode,
        }))
      : activePicker === "city"
      ? cities.map((city, index) => ({
          label: city.name,
          value: city.name,
          key: `${city.name}-${index}`,
        }))
      : activePicker === "lga"
      ? localGovernments.map((lga, index) => ({
          label: lga,
          value: lga,
          key: `${lga}-${index}`,
        }))
      : [];

  // ==========================================================
  // CURRENT PICKER SELECTION
  // ==========================================================

  const currentPickerValue =
    activePicker === "state"
      ? selectedState
      : activePicker === "city"
      ? selectedCity
      : selectedLGA;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          LOCATION BUTTON
      ======================================================= */}

      <Pressable
        onPress={openSelector}
        style={styles.locationButton}
      >
        <View style={styles.locationIcon}>
          <Text style={styles.locationIconText}>
            📍
          </Text>
        </View>

        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>
            Where do you need it?
          </Text>

          <Text
            style={[
              styles.locationValue,
              !hasLocation && styles.placeholder,
            ]}
            numberOfLines={1}
          >
            {hasLocation
              ? locationText ||
                selectedLocation.lga
              : "Select your location"}
          </Text>
        </View>

        <Text style={styles.arrow}>
          ›
        </Text>
      </Pressable>

      {/* ======================================================
          MAIN LOCATION MODAL
      ======================================================= */}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closeSelector}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* HEADER */}

            <View style={styles.modalHeader}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.modalTitle}>
                  Where do you need it?
                </Text>

                <Text style={styles.modalSubtitle}>
                  Select your state, city and LGA.
                </Text>
              </View>

              <Pressable
                onPress={closeSelector}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>
                  ×
                </Text>
              </Pressable>
            </View>

            {/* LOCATION FIELDS */}

            <View style={styles.fieldsContainer}>

              {/* =================================================
                  STATE
              ================================================== */}

              <Text style={styles.sectionLabel}>
                State
              </Text>

              <Pressable
                onPress={() =>
                  setActivePicker("state")
                }
                style={styles.selectButton}
              >
                <View style={styles.selectTextContainer}>

                  <Text
                    style={[
                      styles.selectValue,
                      !selectedState &&
                        styles.selectPlaceholder,
                    ]}
                  >
                    {selectedState ||
                      "Select your state"}
                  </Text>

                </View>

                <Text style={styles.selectArrow}>
                  ›
                </Text>
              </Pressable>

              {/* =================================================
                  CITY
              ================================================== */}

              <Text style={styles.sectionLabel}>
                City
              </Text>

              <Pressable
                disabled={!selectedState}
                onPress={() =>
                  setActivePicker("city")
                }
                style={[
                  styles.selectButton,
                  !selectedState &&
                    styles.disabledSelectButton,
                ]}
              >
                <View style={styles.selectTextContainer}>

                  <Text
                    style={[
                      styles.selectValue,
                      !selectedCity &&
                        styles.selectPlaceholder,
                      !selectedState &&
                        styles.disabledText,
                    ]}
                  >
                    {selectedCity ||
                      (selectedState
                        ? "Select your city"
                        : "Select state first")}
                  </Text>

                </View>

                <Text
                  style={[
                    styles.selectArrow,
                    !selectedState &&
                      styles.disabledText,
                  ]}
                >
                  ›
                </Text>
              </Pressable>

              {/* =================================================
                  LGA
              ================================================== */}

              <Text style={styles.sectionLabel}>
                Local Government Area
              </Text>

              <Pressable
                disabled={!selectedState}
                onPress={() =>
                  setActivePicker("lga")
                }
                style={[
                  styles.selectButton,
                  !selectedState &&
                    styles.disabledSelectButton,
                ]}
              >
                <View style={styles.selectTextContainer}>

                  <Text
                    style={[
                      styles.selectValue,
                      !selectedLGA &&
                        styles.selectPlaceholder,
                      !selectedState &&
                        styles.disabledText,
                    ]}
                  >
                    {selectedLGA ||
                      (selectedState
                        ? "Select your LGA"
                        : "Select state first")}
                  </Text>

                </View>

                <Text
                  style={[
                    styles.selectArrow,
                    !selectedState &&
                      styles.disabledText,
                  ]}
                >
                  ›
                </Text>
              </Pressable>

            </View>

            {/* ==================================================
                FOOTER
            =================================================== */}

            <View style={styles.footer}>

              <Pressable
                onPress={closeSelector}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleApply}
                disabled={!selectedState}
                style={[
                  styles.applyButton,
                  !selectedState &&
                    styles.disabledButton,
                ]}
              >
                <Text style={styles.applyText}>
                  Apply Location
                </Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>

      {/* ======================================================
          OPTION PICKER MODAL
      ======================================================= */}

      <Modal
        visible={Boolean(activePicker)}
        transparent
        animationType="slide"
        onRequestClose={closePicker}
      >
        <View style={styles.modalContainer}>

          <View style={styles.pickerContent}>

            {/* PICKER HEADER */}

            <View style={styles.pickerHeader}>

              <View>
                <Text style={styles.pickerTitle}>
                  {pickerTitle}
                </Text>

                <Text style={styles.pickerSubtitle}>
                  Tap an option to select it.
                </Text>
              </View>

              <Pressable
                onPress={closePicker}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>
                  ×
                </Text>
              </Pressable>

            </View>

            {/* OPTIONS */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                styles.pickerList
              }
            >

              {pickerOptions.length > 0 ? (

                pickerOptions.map((option) => {

                  const selected =
                    currentPickerValue ===
                    option.value;

                  return (
                    <Pressable
                      key={option.key}
                      onPress={() => {

                        if (
                          activePicker ===
                          "state"
                        ) {
                          handleStateSelect(
                            option.value
                          );
                        }

                        if (
                          activePicker ===
                          "city"
                        ) {
                          handleCitySelect(
                            option.value
                          );
                        }

                        if (
                          activePicker ===
                          "lga"
                        ) {
                          handleLGASelect(
                            option.value
                          );
                        }

                      }}
                      style={[
                        styles.pickerOption,
                        selected &&
                          styles.selectedPickerOption,
                      ]}
                    >

                      <Text
                        style={[
                          styles.pickerOptionText,
                          selected &&
                            styles.selectedPickerOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>

                      {selected && (
                        <Text style={styles.checkMark}>
                          ✓
                        </Text>
                      )}

                    </Pressable>
                  );

                })

              ) : (

                <View style={styles.emptyContainer}>

                  <Text style={styles.emptyText}>
                    No options available.
                  </Text>

                </View>

              )}

            </ScrollView>

          </View>

        </View>
      </Modal>
    </>
  );
};

export default LocationSelector;


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  // ==========================================================
  // LOCATION BUTTON
  // ==========================================================

  locationButton: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },

  locationIconText: {
    fontSize: 18,
  },

  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  locationLabel: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
  },

  locationValue: {
    color: "#374151",
    fontSize: 14,
    marginTop: 3,
  },

  placeholder: {
    color: "#9ca3af",
  },

  arrow: {
    color: "#6b7280",
    fontSize: 28,
    marginLeft: 8,
  },

  // ==========================================================
  // MAIN MODAL
  // ==========================================================

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  modalTitle: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "800",
  },

  modalSubtitle: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 5,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "300",
  },

  // ==========================================================
  // FIELDS
  // ==========================================================

  fieldsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  sectionLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },

  selectButton: {
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  disabledSelectButton: {
    opacity: 0.5,
  },

  selectTextContainer: {
    flex: 1,
  },

  selectValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  selectPlaceholder: {
    color: "#9ca3af",
    fontWeight: "500",
  },

  selectArrow: {
    color: "#9ca3af",
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 10,
  },

  disabledText: {
    color: "#6b7280",
  },

  // ==========================================================
  // FOOTER
  // ==========================================================

  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937",
  },

  cancelText: {
    color: "#d1d5db",
    fontSize: 15,
    fontWeight: "700",
  },

  applyButton: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
  },

  disabledButton: {
    backgroundColor: "#4b5563",
  },

  applyText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  // ==========================================================
  // OPTION PICKER
  // ==========================================================

  pickerContent: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "82%",
    paddingTop: 24,
  },

  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  pickerTitle: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "800",
  },

  pickerSubtitle: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 5,
  },

  pickerList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  pickerOption: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  selectedPickerOption: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },

  pickerOptionText: {
    flex: 1,
    color: "#d1d5db",
    fontSize: 15,
    fontWeight: "600",
  },

  selectedPickerOptionText: {
    color: "#ffffff",
  },

  checkMark: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 10,
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: 14,
  },

});