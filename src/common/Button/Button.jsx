import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';

const ButtonMUI = ({
  option = 'primary',
  size = 'medium',
  children,
  isLoading = false,
  className,
  ...props
}) => {
  let buttonTypeClass = '';

  switch (option) {
    case 'primary':
      buttonTypeClass += 'primaryBtn ';
      break;
    case 'secondary':
      buttonTypeClass += 'secondaryBtn ';
      break;
    case 'tertiary':
      buttonTypeClass += 'tertiaryBtn ';
      break;
    case 'danger':
      buttonTypeClass += 'dangerBtn ';
      break;
    default:
      break;
  }

  switch (size) {
    case 'small':
      buttonTypeClass += 'py-[6px]';
      break;
    case 'medium':
      buttonTypeClass += 'py-[11px]';
      break;
    case 'large':
      buttonTypeClass += 'py-[14px]';
      break;
    default:
      break;
  }

  return (
    <LoadingButton
      className={`${buttonTypeClass} ${className}`}
      sx={{
        '&.MuiLoadingButton-root': {
          paddingX: '16px',
          transition: 'all',
          height: 'fit-content',
          textAlign: 'center',
          fontWeight: '500',
          textTransform: 'none',
          minWidth: '0px',
          display: 'flex',
        },
      }}
      {...props}
      loading={isLoading}
    >
      {children}
    </LoadingButton>
  );
};

ButtonMUI.propTypes = {
  option: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

ButtonMUI.defaultProps = {
  option: 'primary',
  size: 'medium',
  isLoading: false,
  className: '',
};

export default ButtonMUI;
