import { ChangeEvent } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export const LabeledInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  disabled,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="border px-2 py-1 rounded w-full"
      />
    </div>
  );
};
