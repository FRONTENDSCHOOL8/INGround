// 스토리북 내에서 데이터 변경이 가능하도록 본 파일 config 전체적으로 수정 필요
import DateInput from './DateInput';
import { createArgTypesControl } from '../../../utils/storybook';

const metaConfig = {
  title: 'components/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  args: {
    id: 'default',
    name: 'default',
    value: '',
  },
  argTypes: {
    id: createArgTypesControl(),
    name: createArgTypesControl(),
    value: createArgTypesControl('date'),
  },
};

export default metaConfig;

export const DefaultState = {
  args: {},
};

DefaultState.storyName = '기본 상태';

export const SelectedState = {
  args: {
    id: 'selected',
    name: 'selected',
    value: '2024-05-15',
  },
};

SelectedState.storyName = '날짜가 선택 된 상태';
