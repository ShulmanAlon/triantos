import { Attribute } from '../../types/attributes';
import { getModifier } from '../../utils/modifier';
import { getPointCostChange } from '../../utils/attributeUtils';

interface AttributeRowProps {
  attr: Attribute;
  value: number;
  baseline: number;
  pool: number;
  onChange: (attr: Attribute, newValue: number, poolDelta: number) => void;
  raceBase: number;
}

export default function AttributeRow({
  attr,
  value,
  baseline,
  pool,
  onChange,
  raceBase,
}: AttributeRowProps) {
  const nextValue = value + 1;
  const prevValue = value - 1;
  const cost = getPointCostChange(value, nextValue, baseline);
  const refund = getPointCostChange(prevValue, value, baseline);
  const min = baseline - 4;
  const max = baseline + 8;

  const canIncrease = value < max && pool >= cost;
  const canDecrease = value > min;

  return (
    <tr style={{ verticalAlign: 'middle' }}>
      {/* Attribute */}
      <td
        style={{
          width: '80px',
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }}
      >
        {attr.toUpperCase()}
      </td>
      <td
        style={{ width: '80px', textAlign: 'center', fontFamily: 'monospace' }}
      >
        {raceBase}
      </td>

      {/* Controls */}
      <td
        style={{
          paddingRight: '16px',
          textAlign: 'center',
          verticalAlign: 'middle',
        }}
      >
        <div
          style={{
            width: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => canDecrease && onChange(attr, prevValue, refund)}
            disabled={!canDecrease}
            style={{
              width: '32px',
              height: '32px',
              fontSize: '18px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              opacity: canDecrease ? 1 : 0.5,
            }}
          >
            −
          </button>

          <div
            style={{
              width: '30px',
              height: '32px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
            }}
          >
            {value}
          </div>

          <button
            onClick={() => canIncrease && onChange(attr, nextValue, -cost)}
            disabled={!canIncrease}
            style={{
              width: '32px',
              height: '32px',
              fontSize: '18px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              opacity: canIncrease ? 1 : 0.5,
            }}
          >
            +
          </button>
        </div>
      </td>

      {/* Mod */}
      <td
        style={{
          paddingRight: '16px',
          fontFamily: 'monospace',
          textAlign: 'right',
          width: '100px',
        }}
      >
        Mod:{' '}
        {getModifier(value) > 0 ? `+${getModifier(value)}` : getModifier(value)}
      </td>

      {/* Next cost */}
      <td style={{ fontFamily: 'monospace', width: '160px' }}>
        Next cost: {cost} pt{cost > 1 ? 's' : ''}
      </td>
    </tr>
  );
}
