from PIL import Image, ImageChops
import os
os.chdir('/tmp/qw-shots')

a = Image.open('F-home.png').convert('RGB')
b = Image.open('D-home-after.png').convert('RGB')
w, h = a.size

# 已知两段差异对应自动轮播（顶部 Banner + 学习路径卡内的 3 个轮播）
carousel_bands = [(65, 664), (1615, 1820)]


def exact_diff(box):
    d = ImageChops.difference(a.crop(box), b.crop(box))
    return d.getbbox()


# 1) 轮播段之外，逐段做精确零差异校验
prev = 0
print('轮播区间之外的精确比对（bbox=None 表示逐像素完全一致）：')
for s, e in carousel_bands:
    if s > prev:
        box = (0, prev, w, s)
        print('   y=%-5d~%-5d -> %s' % (prev, s, exact_diff(box)))
    prev = e + 1
box = (0, prev, w, h)
print('   y=%-5d~%-5d -> %s' % (prev, h, exact_diff(box)))

# 2) 单独确认「最佳实践案例」卡片所在区域完全没动
print('\n痛点/案例屏区域 y=665~1614 精确比对 ->', exact_diff((0, 665, w, 1615)))
