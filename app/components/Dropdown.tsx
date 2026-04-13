import { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

interface DropdownProps {
  value: string;
  placeholder: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export function Dropdown({ value, placeholder, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        onPress={() => setOpen(!open)}
      >
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]}>
          {selectedLabel}
        </Text>
        <Text style={styles.chevron}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        Platform.OS === "web" ? (
          <View style={styles.dropdownWeb}>
            <ScrollView style={styles.optionsList} nestedScrollEnabled>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.option,
                    option.value === value && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
            <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
              <View style={styles.dropdownModal}>
                <ScrollView style={styles.optionsList}>
                  {options.map((option) => (
                    <Pressable
                      key={option.value}
                      style={({ pressed }) => [
                        styles.option,
                        option.value === value && styles.optionSelected,
                        pressed && styles.optionPressed,
                      ]}
                      onPress={() => handleSelect(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          option.value === value && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          </Modal>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  triggerPressed: {
    opacity: 0.8,
  },
  triggerText: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  triggerPlaceholder: {
    color: Colors.textLight,
  },
  chevron: {
    fontSize: 10,
    color: Colors.textLight,
    marginLeft: 8,
  },
  dropdownWeb: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    maxHeight: 240,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 32,
  },
  dropdownModal: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    maxHeight: 400,
    overflow: "hidden",
  },
  optionsList: {
    paddingVertical: 4,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionSelected: {
    backgroundColor: Colors.backgroundWarm,
  },
  optionPressed: {
    backgroundColor: Colors.background,
  },
  optionText: {
    fontSize: 15,
    color: Colors.text,
  },
  optionTextSelected: {
    fontWeight: "600",
    color: Colors.accent,
  },
});
