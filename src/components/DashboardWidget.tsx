import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';
import { CoffeeIcons } from '../../constants/CoffeeIcons';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  color?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  value,
  icon,
  subtitle,
  color = CoffeeColors.accent,
}) => {
  return (
    <View style={[styles.widget, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  widget: {
    ...CoffeeStyles.glassCard,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    minHeight: 80,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    ...CoffeeTypography.bodyMedium,
    flex: 1,
  },
  value: {
    ...CoffeeTypography.headerMedium,
    marginBottom: 4,
  },
  subtitle: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
  },
});