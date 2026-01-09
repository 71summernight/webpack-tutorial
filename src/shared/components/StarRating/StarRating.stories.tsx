import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { StarRating } from './StarRating';

/**
 * StarRating 컴포넌트
 *
 * 영화 평점을 별로 시각화하는 컴포넌트입니다.
 * 0-10점 스케일의 평점을 받아 5개의 별로 표시합니다.
 */
const meta: Meta<typeof StarRating> = {
  title: 'Shared/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
    // 어두운 배경에서 별이 잘 보이도록 설정
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  // autodocs: Props 테이블과 사용법 자동 생성
  tags: ['autodocs'],
  // Controls 패널에서 조작할 수 있는 Props 설정
  argTypes: {
    rating: {
      control: { type: 'range', min: 0, max: 10, step: 0.1 },
      description: '평점 (0-10 스케일)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    maxStars: {
      control: { type: 'number', min: 1, max: 10 },
      description: '표시할 최대 별 개수',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
      },
    },
    size: {
      control: { type: 'number', min: 12, max: 64 },
      description: '별 하나의 크기 (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '24' },
      },
    },
    showScore: {
      control: 'boolean',
      description: '숫자 점수 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// 기본 Stories
// ============================================

/** 기본 상태 - 평점 7.5점 */
export const Default: Story = {
  args: {
    rating: 7.5,
  },
};

/** 점수 텍스트와 함께 표시 */
export const WithScore: Story = {
  args: {
    rating: 8.2,
    showScore: true,
  },
};

// ============================================
// 다양한 평점 상태
// ============================================

/** 낮은 평점 (2.5/10) */
export const LowRating: Story = {
  args: {
    rating: 2.5,
    showScore: true,
  },
};

/** 중간 평점 (5.0/10) */
export const MediumRating: Story = {
  args: {
    rating: 5.0,
    showScore: true,
  },
};

/** 높은 평점 (8.5/10) */
export const HighRating: Story = {
  args: {
    rating: 8.5,
    showScore: true,
  },
};

/** 만점 (10/10) */
export const PerfectScore: Story = {
  args: {
    rating: 10,
    showScore: true,
  },
};

// ============================================
// 크기 변형
// ============================================

/** 작은 크기 (16px) */
export const SmallSize: Story = {
  args: {
    rating: 7.5,
    size: 16,
    showScore: true,
  },
};

/** 큰 크기 (48px) */
export const LargeSize: Story = {
  args: {
    rating: 7.5,
    size: 48,
    showScore: true,
  },
};

// ============================================
// 복합 예시 (render 함수 사용)
// ============================================

/** 모든 평점 비교 - 한눈에 보기 */
export const RatingComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-white text-lg font-bold mb-2">평점별 비교</h3>
      {[2, 4, 6, 8, 10].map((rating) => (
        <div key={rating} className="flex items-center gap-4">
          <span className="w-16 text-gray-400">{rating}/10:</span>
          <StarRating rating={rating} showScore />
        </div>
      ))}
    </div>
  ),
};

/** 크기별 비교 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-white text-lg font-bold mb-2">크기별 비교</h3>
      {[16, 24, 32, 48].map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-16 text-gray-400">{size}px:</span>
          <StarRating rating={7.5} size={size} />
        </div>
      ))}
    </div>
  ),
};
