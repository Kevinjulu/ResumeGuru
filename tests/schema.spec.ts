import { resumeDataSchema } from '../shared/schema';

test('resumeDataSchema default values', () => {
  const result = resumeDataSchema.safeParse({ contactInfo: {} });
  expect(result.success).toBe(true);
  const data = result.success ? result.data : null;
  expect(data?.experiences.length).toBe(0);
  expect(data?.education.length).toBe(0);
  expect(data?.skills.length).toBe(0);
  expect(data?.certifications.length).toBe(0);
  expect(data?.templateId).toBe('clean');
  expect(data?.colorId).toBe('orange');
});
