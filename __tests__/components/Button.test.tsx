import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/core/Button';

// Mock the theme context
jest.mock('../../src/themes/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#4C84FF',
        background: '#FFFFFF',
        text: '#333333',
        disabled: '#C1C1C1',
      },
    },
  }),
}));

describe('Button Component', () => {
  test('renders correctly with default props', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Press Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('renders as disabled when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button title="Disabled Button" onPress={() => {}} disabled testID="button" />
    );
    
    const button = getByTestId('button');
    expect(button.props.style.opacity).toBeLessThan(1);
  });

  test('renders with correct variants', () => {
    const { getByTestId: getPrimary } = render(
      <Button title="Primary" onPress={() => {}} variant="primary" testID="button" />
    );
    
    const { getByTestId: getOutline } = render(
      <Button title="Outline" onPress={() => {}} variant="outline" testID="button" />
    );
    
    const { getByTestId: getSecondary } = render(
      <Button title="Secondary" onPress={() => {}} variant="secondary" testID="button" />
    );
    
    // Check background colors according to variant
    const primaryButton = getPrimary('button');
    const outlineButton = getOutline('button');
    const secondaryButton = getSecondary('button');
    
    expect(primaryButton.props.style.backgroundColor).toBe('#4C84FF'); // Primary color
    expect(outlineButton.props.style.backgroundColor).toBe('transparent');
    expect(secondaryButton.props.style.backgroundColor).not.toBe('#4C84FF');
  });
  
  test('renders with different sizes', () => {
    const { getByTestId: getSmall } = render(
      <Button title="Small" onPress={() => {}} size="small" testID="button" />
    );
    
    const { getByTestId: getMedium } = render(
      <Button title="Medium" onPress={() => {}} size="medium" testID="button" />
    );
    
    const { getByTestId: getLarge } = render(
      <Button title="Large" onPress={() => {}} size="large" testID="button" />
    );
    
    // Check padding according to size
    const smallButton = getSmall('button');
    const mediumButton = getMedium('button');
    const largeButton = getLarge('button');
    
    expect(smallButton.props.style.paddingVertical).toBeLessThan(mediumButton.props.style.paddingVertical);
    expect(mediumButton.props.style.paddingVertical).toBeLessThan(largeButton.props.style.paddingVertical);
  });
});
