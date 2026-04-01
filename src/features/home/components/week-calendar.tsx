import React, { useCallback, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function getWeekDays(ref: Date) {
  const dayOfWeek = ref.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + mondayOffset);

  const now = new Date();
  return DAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      key: `${label}-${d.getDate()}`,
      label,
      date: d.getDate(),
      isToday: sameDay(d, now),
      isSelected: sameDay(d, ref) && !sameDay(d, now),
    };
  });
}

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay();
  if (startDow === 0) startDow = 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean; date: Date }[] = [];

  for (let i = startDow - 2; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells.push({ day, inMonth: false, date: new Date(year, month - 1, day) });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: new Date(year, month, d) });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, inMonth: false, date: new Date(year, month + 1, d) });
    }
  }

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function WeekCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const monthTitle = useMemo(
    () => new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(selectedDate),
    [selectedDate],
  );

  const modalMonthTitle = useMemo(
    () => new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date(viewYear, viewMonth, 1)),
    [viewYear, viewMonth],
  );

  const monthGrid = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const today = useMemo(() => new Date(), []);

  const goToPrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const handleOpenModal = useCallback(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
    setShowModal(true);
  }, [selectedDate]);

  const handleSelectDay = useCallback((date: Date) => {
    setSelectedDate(date);
    setShowModal(false);
  }, []);

  const handleGoToday = useCallback(() => {
    const now = new Date();
    setSelectedDate(now);
    setShowModal(false);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Bu Hafta</Text>
        <TouchableOpacity style={styles.monthButton} hitSlop={8} onPress={handleOpenModal}>
          <Text style={styles.monthText}>{monthTitle}</Text>
          <Ionicons name="calendar-outline" size={16} color={AuthColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={[styles.dayColumn, day.isToday && styles.dayColumnToday, day.isSelected && styles.dayColumnSelected]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday, day.isSelected && styles.dayLabelSelected]}>
                {day.label}
              </Text>
              <View style={[styles.dateCircle, day.isToday && styles.dateCircleToday, day.isSelected && styles.dateCircleSelected]}>
                <Text style={[styles.dateText, day.isToday && styles.dateTextToday, day.isSelected && styles.dateTextSelected]}>
                  {day.date}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Header with nav */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={goToPrevMonth} hitSlop={12} style={styles.navButton}>
                <Ionicons name="chevron-back" size={22} color={AuthColors.white} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{modalMonthTitle}</Text>
              <TouchableOpacity onPress={goToNextMonth} hitSlop={12} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={22} color={AuthColors.white} />
              </TouchableOpacity>
            </View>

            {/* Day labels */}
            <View style={styles.gridRow}>
              {DAY_LABELS.map((l) => (
                <View key={l} style={styles.gridCell}>
                  <Text style={styles.gridDayLabel}>{l}</Text>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            {monthGrid.map((week, wi) => (
              <View key={wi} style={styles.gridRow}>
                {week.map((cell, ci) => {
                  const isToday = sameDay(cell.date, today);
                  const isSel = sameDay(cell.date, selectedDate);
                  return (
                    <TouchableOpacity
                      key={ci}
                      style={styles.gridCell}
                      activeOpacity={0.6}
                      onPress={() => handleSelectDay(cell.date)}
                    >
                      <View style={[
                        styles.gridCircle,
                        isToday && styles.gridCircleToday,
                        isSel && !isToday && styles.gridCircleSelected,
                      ]}>
                        <Text style={[
                          styles.gridDayText,
                          !cell.inMonth && styles.gridDayOutside,
                          isToday && styles.gridDayToday,
                          isSel && !isToday && styles.gridDaySelectedText,
                        ]}>
                          {cell.day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={handleGoToday} style={styles.todayButton}>
                <Text style={styles.todayButtonText}>Bugün</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: AuthSpacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: AuthColors.white, fontSize: 18, fontWeight: '700' },
  monthButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  monthText: { color: AuthColors.primary, fontSize: 14, fontWeight: '600' },

  card: {
    backgroundColor: AuthColors.inputBackground, borderRadius: 16,
    borderWidth: 1, borderColor: AuthColors.inputBorder,
    paddingVertical: AuthSpacing.md, paddingHorizontal: AuthSpacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-around' },

  dayColumn: { alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 12 },
  dayColumnToday: { backgroundColor: 'rgba(0, 230, 118, 0.08)' },
  dayColumnSelected: { backgroundColor: 'rgba(79, 195, 247, 0.08)' },

  dayLabel: { color: AuthColors.whiteSecondary, fontSize: 12, fontWeight: '500' },
  dayLabelToday: { color: AuthColors.primary, fontWeight: '700' },
  dayLabelSelected: { color: '#4FC3F7', fontWeight: '700' },

  dateCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dateCircleToday: { backgroundColor: AuthColors.primary },
  dateCircleSelected: { backgroundColor: '#4FC3F7' },

  dateText: { color: AuthColors.whiteSecondary, fontSize: 14, fontWeight: '600' },
  dateTextToday: { color: '#000', fontWeight: '800' },
  dateTextSelected: { color: '#000', fontWeight: '800' },

  // ── Modal ──
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center', paddingHorizontal: AuthSpacing.lg,
  },
  modalCard: {
    backgroundColor: '#1A1A1A', borderRadius: 20,
    padding: AuthSpacing.lg, gap: AuthSpacing.sm,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: AuthSpacing.sm,
  },
  navButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: {
    color: AuthColors.white, fontSize: 17, fontWeight: '700', textTransform: 'capitalize',
  },

  gridRow: { flexDirection: 'row' },
  gridCell: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  gridDayLabel: { color: AuthColors.whiteSecondary, fontSize: 12, fontWeight: '600' },

  gridCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  gridCircleToday: { backgroundColor: AuthColors.primary },
  gridCircleSelected: { backgroundColor: '#4FC3F7' },

  gridDayText: { color: AuthColors.white, fontSize: 14, fontWeight: '500' },
  gridDayOutside: { color: 'rgba(255,255,255,0.2)' },
  gridDayToday: { color: '#000', fontWeight: '800' },
  gridDaySelectedText: { color: '#000', fontWeight: '800' },

  modalFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: AuthSpacing.md, gap: AuthSpacing.sm,
  },
  todayButton: {
    flex: 1, backgroundColor: AuthColors.primary, borderRadius: 14,
    height: 44, alignItems: 'center', justifyContent: 'center',
  },
  todayButtonText: { color: '#000', fontSize: 15, fontWeight: '700' },
  closeButton: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14,
    height: 44, alignItems: 'center', justifyContent: 'center',
  },
  closeButtonText: { color: AuthColors.white, fontSize: 15, fontWeight: '600' },
});
