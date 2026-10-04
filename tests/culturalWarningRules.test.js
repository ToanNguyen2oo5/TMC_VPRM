import { describe, it, expect } from 'bun:test';
import { evaluateCulturalWarnings } from '../src/services/culturalWarningService';

describe('Kiểm tra 8 Quy Tắc Cảnh Báo Văn Hóa (Cultural Warnings Engine)', () => {
  
  it('Quy tắc 1: Cảnh báo Áo Nhật Bình khi mặc đi Dạo phố', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_nhat_binh', ten: 'Áo Nhật Bình cung đình' },
      event: 'dao-pho',
      accessories: [],
      colors: {}
    });
    console.log('[Test Quy tắc 1]', warnings[0]?.title);
    expect(warnings.length).toBeGreaterThan(0);
    const rule1 = warnings.find(w => w.id === 'rule_01');
    expect(rule1).toBeDefined();
    expect(rule1.type).toBe('warning');
    expect(rule1.recommendedOutfitId).toBe('ao_dai_cach_tan');
  });

  it('Quy tắc 2: Áo tứ thân Kinh Bắc phối Khăn rằn Nam Bộ', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_tu_than', ten: 'Áo tứ thân Kinh Bắc' },
      event: 'le-hoi',
      accessories: ['khan_ran_nam_bo'],
      colors: {}
    });
    console.log('[Test Quy tắc 2]', warnings[0]?.title);
    const rule2 = warnings.find(w => w.id === 'rule_02');
    expect(rule2).toBeDefined();
    expect(rule2.type).toBe('caution');
  });

  it('Quy tắc 3: Áo bà ba Nam Bộ phối Khăn vành dây cung đình Huế', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_ba_ba_nam_bo', ten: 'Áo bà ba Nam Bộ' },
      event: 'hang-ngay',
      accessories: ['khan_vanh_day'],
      colors: {}
    });
    console.log('[Test Quy tắc 3]', warnings[0]?.title);
    const rule3 = warnings.find(w => w.id === 'rule_02b');
    expect(rule3).toBeDefined();
    expect(rule3.type).toBe('caution');
  });

  it('Quy tắc 4: Tổ hợp màu đen - trắng thuần túy trong dịp Tết / Hỷ sự', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_dai_hue', ten: 'Áo dài truyền thống' },
      event: 'tet',
      accessories: [],
      colors: { primary: '#000000', secondary: '#ffffff' }
    });
    console.log('[Test Quy tắc 4]', warnings[0]?.title);
    const rule4 = warnings.find(w => w.id === 'rule_04');
    expect(rule4).toBeDefined();
    expect(rule4.type).toBe('warning');
  });

  it('Quy tắc 5: Áo dài trắng nam giới trong dịp dạo phố', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_dai_hue', ten: 'Áo dài truyền thống', gioi_tinh: 'nam' },
      event: 'dao-pho',
      accessories: [],
      colors: { primary: '#ffffff' }
    });
    console.log('[Test Quy tắc 5]', warnings[0]?.title);
    const rule5 = warnings.find(w => w.id === 'rule_05');
    expect(rule5).toBeDefined();
    expect(rule5.type).toBe('info');
    expect(rule5.fixAction).toBeDefined();
  });

  it('Quy tắc 6: Áo tấc triều Nguyễn phối Nón quai thao Bắc Bộ', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_ngu_than_ao_tac', ten: 'Áo ngũ thân / Áo tấc' },
      event: 'tet',
      accessories: ['non_quai_thao'],
      colors: {}
    });
    console.log('[Test Quy tắc 6]', warnings[0]?.title);
    const rule6 = warnings.find(w => w.id === 'rule_06');
    expect(rule6).toBeDefined();
    expect(rule6.type).toBe('caution');
    expect(rule6.fixAction?.type).toBe('replace_accessory');
  });

  it('Quy tắc 7: Vải thô đũi trong lễ cưới đại hỷ', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_tu_than', ten: 'Áo tứ thân', chat_lieu: 'Vải đũi thô' },
      event: 'dam-cuoi',
      accessories: [],
      colors: {}
    });
    console.log('[Test Quy tắc 7]', warnings[0]?.title);
    const rule7 = warnings.find(w => w.id === 'rule_07');
    expect(rule7).toBeDefined();
    expect(rule7.type).toBe('info');
  });

  it('Quy tắc 8: Kiểm tra quy thức vạt chéo Hữu Nhậm Áo Giao lĩnh', () => {
    const warnings = evaluateCulturalWarnings({
      outfit: { id: 'ao_giao_linh', ten: 'Áo giao lĩnh cổ truyền' },
      event: 'chup-anh-di-san',
      accessories: [],
      colors: {}
    });
    console.log('[Test Quy tắc 8]', warnings[0]?.title);
    const rule8 = warnings.find(w => w.id === 'rule_08');
    expect(rule8).toBeDefined();
    expect(rule8.type).toBe('info');
  });

});
