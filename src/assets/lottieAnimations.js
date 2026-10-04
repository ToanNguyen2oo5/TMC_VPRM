/**
 * Các bộ dữ liệu hoạt họa Lottie JSON cho Việt Phục Remix
 * Thiết kế chuẩn Bodymovin 5.5+, tương thích 100% với lottie-web
 */

// 1. Hoa sen hé nở & đung đưa nhẹ nhàng (Lotus Bloom)
export const lotusBloomAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 90,
  w: 120,
  h: 120,
  nm: "Lotus Bloom",
  ddd: 0,
  assets: [],
  layers: [
    // Nhụy sen vàng trung tâm
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Core Center",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 45, s: [15] },
            { t: 90, s: [0] }
          ]
        },
        p: { a: 0, k: [60, 62, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100] },
            { t: 45, s: [110, 110, 100] },
            { t: 90, s: [90, 90, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [22, 22] },
              p: { a: 0, k: [0, 0] },
              nm: "Center Ellipse"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.98, 0.78, 0.25, 1] }, // Vàng hoàng kim
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Center Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    // Cánh sen chính giữa (đỉnh)
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Petal Top",
      sr: 1,
      ks: {
        o: { a: 0, k: 95 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 45, s: [-6] },
            { t: 90, s: [0] }
          ]
        },
        p: { a: 0, k: [60, 50, 0] },
        a: { a: 0, k: [0, 15, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100] },
            { t: 45, s: [105, 112, 100] },
            { t: 90, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: true,
                  i: [[-10, 12], [0, -16], [10, 12]],
                  o: [[0, -16], [10, 12], [-10, 12]],
                  v: [[-14, 12], [0, -22], [14, 12]]
                }
              },
              nm: "Petal Path"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.93, 0.28, 0.48, 0.9] }, // Hồng cánh sen
              o: { a: 0, k: 95 },
              r: 1,
              nm: "Petal Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    // Cánh sen trái
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Petal Left",
      sr: 1,
      ks: {
        o: { a: 0, k: 90 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-35] },
            { t: 45, s: [-45] },
            { t: 90, s: [-35] }
          ]
        },
        p: { a: 0, k: [54, 58, 0] },
        a: { a: 0, k: [0, 12, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100] },
            { t: 45, s: [102, 108, 100] },
            { t: 90, s: [95, 95, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: true,
                  i: [[-8, 10], [0, -14], [8, 10]],
                  o: [[0, -14], [8, 10], [-8, 10]],
                  v: [[-12, 10], [0, -18], [12, 10]]
                }
              },
              nm: "Petal Left Path"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.95, 0.42, 0.58, 0.85] },
              o: { a: 0, k: 90 },
              r: 1,
              nm: "Petal Left Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    // Cánh sen phải
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Petal Right",
      sr: 1,
      ks: {
        o: { a: 0, k: 90 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [35] },
            { t: 45, s: [45] },
            { t: 90, s: [35] }
          ]
        },
        p: { a: 0, k: [66, 58, 0] },
        a: { a: 0, k: [0, 12, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100] },
            { t: 45, s: [102, 108, 100] },
            { t: 90, s: [95, 95, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: true,
                  i: [[-8, 10], [0, -14], [8, 10]],
                  o: [[0, -14], [8, 10], [-8, 10]],
                  v: [[-12, 10], [0, -18], [12, 10]]
                }
              },
              nm: "Petal Right Path"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.95, 0.42, 0.58, 0.85] },
              o: { a: 0, k: 90 },
              r: 1,
              nm: "Petal Right Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ]
};

// 2. Ngôi sao hoàng kim lấp lánh (Golden Sparkle / AI Magic)
export const sparkleAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Golden Sparkle",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Main Star",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [70] },
            { t: 30, s: [100] },
            { t: 60, s: [70] }
          ]
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 60, s: [90] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [75, 75, 100] },
            { t: 30, s: [115, 115, 100] },
            { t: 60, s: [75, 75, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: true,
                  i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  v: [[0, -28], [6, -7], [28, 0], [6, 7], [0, 28], [-6, 7], [-28, 0], [-6, -7]]
                }
              },
              nm: "Star Path"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.85, 0.69, 0.35, 1] }, // Vàng kim cổ điển (#D4AF37)
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Star Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    // Chấm sao nhỏ phụ
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Little Star",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [30] },
            { t: 25, s: [90] },
            { t: 60, s: [30] }
          ]
        },
        r: { a: 0, k: 45 },
        p: { a: 0, k: [76, 26, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [40, 40, 100] },
            { t: 30, s: [85, 85, 100] },
            { t: 60, s: [40, 40, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: true,
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  v: [[0, -10], [10, 0], [0, 10], [-10, 0]]
                }
              },
              nm: "Mini Star Path"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.98, 0.88, 0.55, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Mini Star Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
};

// 3. Đèn lồng Hội An đung đưa nhẹ (Hoi An Lantern)
export const lanternAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 80,
  w: 100,
  h: 120,
  nm: "Lantern",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Lantern Body",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-8] },
            { t: 40, s: [8] },
            { t: 80, s: [-8] }
          ]
        },
        p: { a: 0, k: [50, 15, 0] },
        a: { a: 0, k: [0, -35, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        // Dây treo
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: false,
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                  v: [[0, -35], [0, -18]]
                }
              },
              nm: "Rope Path"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.85, 0.69, 0.35, 1] },
              w: { a: 0, k: 2 },
              o: { a: 0, k: 100 },
              nm: "Rope Stroke"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        },
        // Thân đèn lồng bầu dục
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [36, 46] },
              p: { a: 0, k: [0, 6] },
              nm: "Body Ellipse"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.85, 0.18, 0.18, 0.95] }, // Đỏ son trầm
              o: { a: 0, k: 95 },
              r: 1,
              nm: "Body Fill"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.95, 0.75, 0.3, 1] },
              w: { a: 0, k: 1.5 },
              o: { a: 0, k: 80 },
              nm: "Gold Rim"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        },
        // Tua rua lụa vàng bên dưới
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: false,
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                  v: [[0, 30], [0, 50]]
                }
              },
              nm: "Tassel Path"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.95, 0.82, 0.35, 1] },
              w: { a: 0, k: 3 },
              o: { a: 0, k: 100 },
              nm: "Tassel Stroke"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 80,
      st: 0,
      bm: 0
    }
  ]
};

// 4. Chatbot icon hoạt họa (Vòng sóng thông minh & cuộn thư)
export const chatConsultantAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Chat Consultant",
  ddd: 0,
  assets: [],
  layers: [
    // Vòng sóng phát sáng
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pulse Ring",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [90] },
            { t: 40, s: [20] },
            { t: 60, s: [0] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [75, 75, 100] },
            { t: 60, s: [140, 140, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [46, 46] },
              p: { a: 0, k: [0, 0] },
              nm: "Ring Ellipse"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.85, 0.69, 0.35, 1] },
              w: { a: 0, k: 2 },
              o: { a: 0, k: 100 },
              nm: "Ring Stroke"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    // Bong bóng chat chính
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Chat Bubble",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 30, s: [4] },
            { t: 60, s: [0] }
          ]
        },
        p: { a: 0, k: [50, 48, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100] },
            { t: 30, s: [105, 105, 100] },
            { t: 60, s: [95, 95, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [46, 38] },
              p: { a: 0, k: [0, 0] },
              nm: "Bubble Ellipse"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.85, 0.69, 0.35, 1] }, // Vàng hoàng kim
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Bubble Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        },
        // 3 chấm gõ tin nhắn (typing dots)
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [5, 5] },
              p: { a: 0, k: [-10, 0] },
              nm: "Dot 1"
            },
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [5, 5] },
              p: { a: 0, k: [0, 0] },
              nm: "Dot 2"
            },
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [5, 5] },
              p: { a: 0, k: [10, 0] },
              nm: "Dot 3"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.1, 0.08, 0.07, 1] }, // Màu mực tàu
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Dots Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
};

// 5. Mặt trời văn hóa (Weather Sun / Thời tiết)
export const weatherSunAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 90,
  w: 100,
  h: 100,
  nm: "Weather Sun",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Sun Rays",
      sr: 1,
      ks: {
        o: { a: 0, k: 90 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 90, s: [360] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100] },
            { t: 45, s: [105, 105, 100] },
            { t: 90, s: [90, 90, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [4, 12] },
              p: { a: 0, k: [0, -26] },
              nm: "Ray Top"
            },
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [4, 12] },
              p: { a: 0, k: [0, 26] },
              nm: "Ray Bottom"
            },
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [12, 4] },
              p: { a: 0, k: [-26, 0] },
              nm: "Ray Left"
            },
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [12, 4] },
              p: { a: 0, k: [26, 0] },
              nm: "Ray Right"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.98, 0.72, 0.15, 1] },
              o: { a: 0, k: 90 },
              r: 1,
              nm: "Rays Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Sun Core",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100] },
            { t: 45, s: [105, 105, 100] },
            { t: 90, s: [95, 95, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [32, 32] },
              p: { a: 0, k: [0, 0] },
              nm: "Sun Circle"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.99, 0.55, 0.18, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Sun Core Fill"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ]
};
