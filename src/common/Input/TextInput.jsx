import PropTypes from 'prop-types';
import { Box, FormControl, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

TextInput.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    id: PropTypes.string,
    noteMessage: PropTypes.string,
    required: PropTypes.bool,
    control: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    rules: PropTypes.object,
    error: PropTypes.bool,
    className: PropTypes.string,
    defaultValue: PropTypes.string, 
    containerClassName: PropTypes.string,
    onFieldChange: PropTypes.func,
    tooltip: PropTypes.node,
    placeholder: PropTypes.string,
    multiline: PropTypes.bool,
    type : PropTypes.string,
    sx: PropTypes.object,
  };
  
export default function TextInput({
  label,
  id,
  noteMessage,
  required = false,
  control,
  name,
  rules,
  error,
  className,
  defaultValue = '',
  containerClassName = '',
  onFieldChange,
  ...props
}) {
  const { placeholder } = props;
 
  return (
    <div className={containerClassName}>
      <Controller
        name={name}
        rules={{
          required: {
            value: required,
            message: `${label} là bắt buộc`,
          },
          ...rules,
        }}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <FormControl fullWidth>
              <Box className="flex gap-[8px]">
                {label && (
                  <label className="mb-[10px] block text-text1 text-[14px] font-[600]">
                    {label} {required && <span className="text-red">*</span>}
                  </label>
                )}
              </Box>
              <TextField
                id={id || name}
                className={`w-full ${className}`}
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value.normalize('NFC');
                  if (newValue.trim() === '') {
                    onChange('');
                    onFieldChange && onFieldChange('');
                  } else {
                    onChange(newValue);
                    onFieldChange && onFieldChange(newValue);
                  }
                }}
                placeholder={
                  placeholder ??
                  `${'Nhập'} ${
                    typeof label === 'string' ? label.toLowerCase() : ''
                  }`
                }
                onBlur={() => {
                  onBlur();
                }}
                error={error}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: props?.multiline ? '10px' : '12px 18px', 
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: props?.multiline ? '8px' : '40px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#232D3A',
                    minHeight: '50px', 
                    height: 'fit-content',
                    '& fieldset': {
                      border: `1px solid ${!error ? '#E9EAEB' : '#BC2649'}`,
                    },
                    '&.Mui-focused fieldset': {
                      border: `1px solid ${!error ? '#2C80FF' : '#BC2649'}`,
                    },
                    '&:hover fieldset': {
                      border: `1px solid ${!error ? '#2C80FF' : '#BC2649'}`,
                    },
                  },
                  ...props.sx,
                }}
                
                onKeyDown={(e) => {
                  if (props?.type === 'number') {
                    const charCode = typeof e.which === 'undefined' ? e.keyCode : e.which;
                    const charStr = String.fromCharCode(charCode);
                    if (!(charStr.match(/^[0-9]+$/) || charCode === 8)) {
                      e.preventDefault();
                    }
                  }
                }}
                {...props}
              />
              {noteMessage && (
                <span
                  className={`mt-[10px] text-[12px] block ${
                    error ? 'text-red' : 'text-secondaryText70'
                  }`}
                >
                  {noteMessage}
                </span>
              )}
            </FormControl>
          </>
        )}
      />
    </div>
  );
}

