import { styled } from 'nativewind';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useColorScheme } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  placeholder?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  placeholder,
  multiline,
  ...rest
}: FormInputProps<T>) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <StyledView className="mb-4">
      <StyledText className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
        {label}
      </StyledText>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            className={`border ${error ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-300'} 
              rounded-lg p-4 ${multiline ? 'h-32' : ''} 
              ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
            placeholder={placeholder}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...rest}
          />
        )}
      />
      {error && (
        <StyledText className="text-red-500 dark:text-red-400 text-xs mt-1">
          {error}
        </StyledText>
      )}
    </StyledView>
  );
} 