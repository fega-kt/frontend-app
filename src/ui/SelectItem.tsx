import { cn } from '@/utils';
import { Select, SelectProps } from 'antd';
import { compact, uniqBy } from 'lodash';
import { useCallback, useMemo } from 'react';

/* =======================
 * Types
 * ======================= */

export interface IItemSelect {
  id: string;
  name: string;
}

type SelectMode = 'multiple' | 'tags' | undefined;

type SelectValueByMode<M extends SelectMode> = M extends 'multiple' | 'tags'
  ? IItemSelect[]
  : IItemSelect | undefined;

interface SelectItemProps<M extends SelectMode = undefined>
  extends Omit<SelectProps<string>, 'options' | 'onChange' | 'value' | 'size'> {
  className?: string;
  classNameTrigger?: string;
  disabled?: boolean;

  mode?: M;

  /** object / object[] */
  value?: SelectValueByMode<M>;
  onChange?: (value: SelectValueByMode<M>) => void;

  dataSource: IItemSelect[];
}

type SelectedValue = string | string[];

/* =======================
 * Helpers
 * ======================= */

function mapValueToSelectValue<M extends SelectMode>(
  value?: SelectValueByMode<M>,
  mode?: M
): string | string[] | undefined {
  if (!value) return undefined;

  if (mode === 'multiple' || mode === 'tags') {
    return (value as IItemSelect[]).map((v) => v.id);
  }

  return (value as IItemSelect).id;
}

/* =======================
 * Component
 * ======================= */

function SelectItem<M extends SelectMode = undefined>(
  props: SelectItemProps<M>
) {
  const {
    className = '',
    disabled,
    value,
    onChange,
    dataSource = [],
    ...rest
  } = props;

  /* Map options */
  const options = useMemo(
    () =>
      uniqBy(compact(dataSource), 'id').map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [dataSource]
  );

  /* Handle change */
  const handleChange = useCallback(
    (selected: SelectedValue) => {
      if (!selected) {
        onChange?.(undefined as SelectValueByMode<M>);
        return;
      }

      if (rest.mode === 'multiple' || rest.mode === 'tags') {
        const selectedItems = (selected as string[])
          .map((id) => dataSource.find((u) => u.id === id))
          .filter(Boolean) as IItemSelect[];

        onChange?.(selectedItems as SelectValueByMode<M>);
      } else {
        const selectedItem =
          dataSource.find((u) => u.id === selected) || undefined;

        onChange?.(selectedItem as SelectValueByMode<M>);
      }
    },
    [dataSource, onChange, rest.mode]
  );

  /* Disabled view */
  if (disabled) {
    return (
      <div className={cn(className, 'items-center')}>
        {Array.isArray(value)
          ? value.map((v) => v.name).join(', ')
          : value?.name || ''}
      </div>
    );
  }
  return (
    <div className={cn(className, 'items-center')}>
      <Select
        {...rest}
        showSearch
        style={{ width: '100%' }}
        value={mapValueToSelectValue(value, rest.mode)}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
}

export default SelectItem;
