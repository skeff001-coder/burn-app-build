import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');

const MOVEMENTS = [
  {
    id: 1,
    name: 'Toe Tapping While Thinking',
    description: 'Tap your toes rhythmically...',
    calories: 8,
    duration: '5 min',
    icon: '🎵',
    category: 'Micro',
  },
  {
    id: 2,
    name: 'Leg Shaking While Sitting',
    description: 'Bounce your leg steadily...',
    calories: 10,
    duration: '10 min',
    icon: '⚡',
    category: 'Micro',
  },
  {
    id: 3,
    name: 'Deliberate Posture Reset',
    description: 'Sit tall, pull shoulder blades...',
    calories: 5,
    duration: '1 min',
    icon: '🧍',
    category: 'Micro',
  },
  {
    id: 4,
    name: 'Grocery One-Bag Retrieval',
    description: 'Carry shopping bags...',
    calories: 18,
    duration: '5 min',
    icon: '🛒',
    category: 'Lazy',
  },
  {
    id: 5,
    name: 'Far Parking Walk',
    description: 'Park at the furthest...',
    calories: 20,
    duration: '5 min',
    icon: '🚗',
    category: 'Lazy',
  },
];

const ImprovedMovementLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [loggedToday, setLoggedToday] = useState([]);

  const categories = ['All', 'Micro', 'Lazy'];

  const filteredMovements =
    selectedCategory === 'All'
      ? MOVEMENTS
      : MOVEMENTS.filter((m) => m.category === selectedCategory);

  const handleLogActivity = (movement) => {
    setSelectedMovement(movement);
    setModalVisible(true);
  };

  const confirmLog = () => {
    if (selectedMovement) {
      setLoggedToday([...loggedToday, selectedMovement.id]);
    }
    setModalVisible(false);
  };

  const totalCalories = selectedMovement?.calories || 0;
  const totalLogged = loggedToday.length;
  const totalCaloriesBurned = loggedToday.reduce((sum, id) => {
    const movement = MOVEMENTS.find((m) => m.id === id);
    return sum + (movement?.calories || 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Move Library</Text>
        <Text style={styles.headerSubtitle}>Log real movements you actually do</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalLogged}</Text>
          <Text style={styles.statLabel}>Logged today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalCaloriesBurned}</Text>
          <Text style={styles.statLabel}>kcal burned</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat && styles.categoryButtonTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Movement List */}
      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.movementList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movementCard}
            onPress={() => handleLogActivity(item)}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>~{item.calories} kcal</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{item.duration}</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardRight}>
              <View style={styles.calorieBox}>
                <Text style={styles.calorieBadge}>+{item.calories}</Text>
                <Text style={styles.calorieLabel}>kcal</Text>
              </View>
              <TouchableOpacity
                style={styles.logButton}
                onPress={() => handleLogActivity(item)}
              >
                <Text style={styles.logButtonText}>Log</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMovement && (
              <>
                {/* Icon Section */}
                <View style={styles.modalIconSection}>
                  <Text style={styles.modalIcon}>{selectedMovement.icon}</Text>
                </View>

                {/* Title & Description */}
                <Text style={styles.modalTitle}>{selectedMovement.name}</Text>
                <Text style={styles.modalDescription}>
                  {selectedMovement.description}
                </Text>

                {/* Activity Details */}
                <View style={styles.detailsBox}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{selectedMovement.duration}</Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Calories Burned:</Text>
                    <Text style={styles.detailValue}>
                      +{selectedMovement.calories} kcal
                    </Text>
                  </View>
                </View>

                {/* Explanation */}
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationTitle}>
                    ℹ️ What This Means
                  </Text>
                  <Text style={styles.explanationText}>
                    You're confirming that you {selectedMovement.name.toLowerCase()} for about {selectedMovement.duration.toLowerCase()}. Your MET-based burn calculation is already personalized to your weight.
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmLog}
                  >
                    <Text style={styles.confirmButtonText}>
                      ✓ Log This Activity
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4ade80',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4ade80',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryButtonActive: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#0a0e27',
  },
  movementList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  movementCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#0a0e27',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  metaDot: {
    color: '#444',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  calorieBox: {
    alignItems: 'center',
  },
  calorieBadge: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4ade80',
  },
  calorieLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  logButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0a0e27',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1f3a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  modalIconSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    fontSize: 72,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsBox: {
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ade80',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 8,
  },
  explanationBox: {
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#4ade80',
    marginBottom: 24,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 14,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4ade80',
    borderRadius: 10,
    paddingVertical: 14,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0e27',
    textAlign: 'center',
  },
});

export default ImprovedMovementLibrary;
