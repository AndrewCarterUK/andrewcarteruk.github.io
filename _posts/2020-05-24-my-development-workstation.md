---
layout: post
title: My Development Workstation
date: 2020-05-24
categories: programming
excerpt: I am quite frugal with my spending, and I spend quite a lot of time trying to identify the best value equipment. This post explains my current software development workstation and shows where the equipment I have selected can be purchased.
---

I am quite frugal with my spending, and I spend quite a lot of time trying to identify the best value equipment. This post explains my current software development workstation and links to where the equipment I have selected can be purchased.

As I am not a gamer, all of the decisions I have had to make have focused entirely on improving my efficiency developing.

Luckily, I built my computer just before the United Kingdom entered lockdown due to COVID-19. I have noticed that the price of a lot of the items that I purchased creating this workstation has since increased by quite a bit. I imagine that this is because the pandemic has caused a shortage in supply and an increase in demand for many computing components.

![my development workstation](/images/development-workstation.png)

## Quick Links

- **[Computer](#computer)**
- **[Monitors](#monitors)**
- **[Accessories](#accessories)**
- **[Audio](#audio)**
- **[Software](#software)**
- **[Furniture](#furniture)**

## Computer

The processor that I selected was the [AMD Ryzen 5 3600](https://www.ebuyer.com/883794-amd-ryzen-5-3600-am4-cpu-processor-with-wraith-stealth-cooler-100-100000031box). Multiple CPU benchmarking websites showed that it offered the best performance within my budget range by some margin. As this is not a gaming computer, reliability is more of a concern than overclocking and the stock CPU cooler is more than sufficient.

I spent a bit of time trying to establish whether the [B450 TOMAHAWK MAX](https://www.ebuyer.com/909585-msi-b450-tomahawk-max-amd-am4-motherboard-b450-tomahawk-max) motherboard was compatible with the CPU that I had selected. There was some chatter on forums about have to update the BIOS of the motherboard to get it to work. I did not have to do this, and the system posted and booted first time without issue.

When selecting an SSD, I nearly got caught out buying one with a SATA interface rather than an NVMe interface. SSDs are so fast that they are limited by the SATA bus speed, so you get a big chunk of extra performance for not very much money if you purchase one with an NVMe interface. The SSD that I chose was the [WD Blue SN550 500GB NVME](https://www.ebuyer.com/947318-wd-blue-sn550-500gb-nvme-m-2-2280-pcie-gen3-ssd-wds500g2b0c).

The RAM kit that I selected was the [Termaltake Toughram Z-One RGB 16GB DDR4 3600MHz](https://www.ebuyer.com/950732-thermaltake-toughram-z-one-rgb-16gb-2x8gb-ddr4-3600mhz-c18-memory-r019d408gx2-3600c18a). I chose 16GB because 32GB felt like overkill and I know that I can always upgrade later if required. It took a bit of time to settle on 3600MHz, but it felt like that was the number that hit the price performance sweet spot I was looking for. I wanted RGB RAM because I knew I was buying a case with a glass panel.

The power supply was probably the component I was least interested in. I ended up selecting the [Termaltake Litepower 550W PSU](https://www.ebuyer.com/845737-thermaltake-litepower-550w-psu-ps-ltp-0550npcnuk-2) because it was good value and the reviews suggested the cables were good quality.

I would probably class the graphics card that I selected as the only mistake that I made during this build. I chose the [Radeon RX 570](https://www.ebuyer.com/828167-msi-rx-570-armor-8gb-oc-gddr5-graphics-card-rx-570-armor-8g-oc) because it provided three DisplayPort interfaces and had more memory than the equivalent NVIDIA card that I was considering. The reason I regret this purchase is because I do experiment with personal machine learning projects. When I saw that the [AMD ROCm Platform](https://rocmdocs.amd.com/en/latest/index.html) had an official tensorflow upstream package, I had hoped that was an indication of AMD catching up NVIDIA in the field of GPU computing. Unfortunately, the very first model I built crashed for an unexplainable reason when constructing a MaxPooling layer through Keras. If you are at all interested in using your graphics card for machine learning then you should stick with NVIDIA products. The support and stability of the AMD ROCm Platform is still a long way off.

I wanted a case with a glass panel on the side, because I think that these look quite nice. If you are looking for something similar, be careful of cheaper cases that have an acrylic panel. In the end, I chose the [EG Black & Mesh ATX Tower Case](https://www.ebuyer.com/845845-eg-black-mesh-atx-tower-computer-case-lpma001). I also wanted a case that had two front fans and one rear fan. This creates an outward pressure gradient from inside the case which helps to prevent against dust ingress. Although I would not class it as a mistake, I would probably not recommend this case. The drilling of the holes in the glass panel did not quite match the case, which makes it very easy to cross thread the screws that hold it in place. I have definitely ruined one of them and, although it still bites, it sits at a slight angle and makes me scared every time I have to open the case up.

## Monitors

If I had to pick, I would say that my monitors are by far my favourite part of my workstation. As they are primarily used for software development, they needed to have a good screen resolution and lots of space. I chose [Samsung UE590D 28" Ultra HD](https://www.ebuyer.com/707243-samsung-ue590d-28-ultra-hd-freesync-monitor-lu28e590ds-en) monitors as there were no other 4K monitors of the same quality that were even close to the same price point. I originally purchased three of these, however the three of them together only barely fit on my desk so I decided that the third was unnecessary.

I was prepared to spend a bit more to avoid the cheapest monitor stands that were on the market. I ended up going for the [PUTORSEN PC Dual Monitor Arm 17"-32"](https://www.amazon.co.uk/dp/B07BBLLQFD/ref=pe_3187911_185740111_TE_item) because they supported 28" monitors (many stop at 27") and looked like they were going to be stable enough to hold the weight.

It is almost impossible to get the monitors to line up perfectly without any gap between them. I initially tried using some tape on the back to secure them, this worked well but it was a ballache if you ever had to move them. Instead of trying to get them to match perfectly, I have since opted to leave a 1cm gap between the panels. This way it does not bug me if they are 1mm out of alignment with each other.

## Accessories

My criteria for a keyboard and mouse was quite simple. Both needed to have a cable, because I cannot afford to have the interruption of changing batteries or having to wait for something to charge. I wanted a mechanical keyboard with RGB backlighting, so I went for the [EG Carbon MK II](https://www.ebuyer.com/855003-eg-carbon-mk-ii-tournament-edition-keyboard-red-switch-kb435l) and the [EG Nitro Mouse](https://www.ebuyer.com/855001-eg-nitro-mouse-ms809). If I have one complaint, it is that the mouse scroll wheel is a bit squeaky.

## Audio

My recording equipment was purchased a few years ago, but it is still worthy of a mention. I have a [Behringer C-1](https://www.gear4music.com/PA-DJ-and-Lighting/Behringer-C-1-Condenser-Microphone/1OT) condenser microphone. This requires a mixer that is capable of supplying phantom power and a USB audio interface. I chose the [SubZero SZ-MIX04](https://www.gear4music.com/PA-DJ-and-Lighting/SubZero-SZ-MIX04-4-Channel-Mini-Mixer/SIZ) as my mixer and the [Behringer U-Control UCA222](https://www.gear4music.com/Recording-and-Computers/Behringer-U-Control-UCA222-USB-Audio-Interface/AML) as my USB audio interface. The mixer appealed to me as it could supply phantom power to two microphones, which I thought could be useful for podcasting.

If you are looking to purchase a microphone, I recommend first going to YouTube and checking to see if you can see any reviews of the models that you are interested in. Most reviews will actually include recordings taken with the microphone, so you can hear how the recordings sound for yourself.

## Software

My productivity developing software is almost entirely dependent upon a tiling window manager and I get very frustrated if I ever have to work on a machine that does not have one. The window manager I am most familiar with is [i3](https://i3wm.org/). I am also most familiar with debian based Linux distributions, so [Regolith Linux](https://regolith-linux.org/) seemed like an obvious choice.

![development workstation software](/images/development-workstation-software.jpg)

Over time I have evolved my i3 configuration to my preferences, and I am now very happy with it. I find it effortless and fast to arrange my desktop exactly how I want it, and get the most out of my available screen space.

## Furniture

My chair is definitely not anything to write home about, and my partner hates it. My desk, however, is something that I am quite proud of. As you can see, I built it to perfectly fit into an alcove in our study. Building it was very easy, I simply attached some [table legs from B&Q](https://www.diy.com/departments/rothley-710mm-chrome-effect-designer-leg/254312_BQ.prd) to a [kitchen worktop (also from B&Q)](https://www.diy.com/departments/28mm-matt-brown-oak-effect-laminate-round-edge-kitchen-worktop-l-2400mm/3663602636168_BQ.prd) that was cut to size in store. I needed an extra leg in the middle underneath the table to stop it from bowing, but this leg does not bother me and I hardly notice that it is there.
