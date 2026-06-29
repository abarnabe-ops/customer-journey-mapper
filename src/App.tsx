import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { AvatarPill } from "./components/AvatarPill";
import { ChangelogModal } from "./components/ChangelogModal";
import { CHANGELOG } from "./changelog";
import { storageGet, storageSet, storageDelete } from "./lib/supabase";
import { useLanguage } from "./contexts/LanguageContext";
import type { Translations } from "./i18n";

const ARROW_COLORS=["#94A3B8","#2563EB","#22C55E","#F97316","#EF4444","#8B5CF6","#EC4899","#FBBF24"];
const FONTS=[
  {label:"Inter",v:"'Inter',system-ui,sans-serif"},
  {label:"Georgia",v:"Georgia,serif"},
  {label:"Courier",v:"'Courier New',monospace"},
  {label:"Arial",v:"Arial,sans-serif"},
  {label:"Times NR",v:"'Times New Roman',serif"},
  {label:"Trebuchet",v:"'Trebuchet MS',sans-serif"},
];
const SIZES=[10,12,14,18,24,36,48,72];

const LOGOS={
  google:(<svg viewBox="0 0 67 67" width="67" height="67" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#34A853"/>
<path d="M24.3533 42.8197C24.3533 45.6787 22.0356 47.9964 19.1766 47.9964C16.3177 47.9964 14 45.6787 14 42.8197C14 39.9607 16.3177 37.6431 19.1766 37.6431C22.0356 37.6431 24.3533 39.9607 24.3533 42.8197Z" fill="white"/>
<path d="M28.9786 18.4213C31.3025 16.1159 35.1478 16.6914 36.7294 19.5943C40.5387 26.6517 44.6468 33.5569 48.547 40.5634L48.5481 40.5654C50.2419 43.5919 48.4039 47.419 45.0413 47.9377C42.9757 48.2514 41.0455 47.2989 39.9596 45.3833C36.0254 38.4078 31.941 31.5174 28.0512 24.5187L28.0482 24.5134C27.5893 23.6988 27.3746 22.8164 27.3943 21.8721C27.4364 21.3154 27.5008 20.9169 27.6604 20.592L27.683 20.5459L27.701 20.4978C28.0091 19.6746 28.4109 18.9757 28.9728 18.427L28.9786 18.4213Z" fill="white"/>
<path d="M24.9986 21.7332C24.9556 22.9575 25.2563 24.0944 25.8576 25.1584C27.4326 27.913 29.0075 30.6823 30.5681 33.4516C30.6312 33.5608 30.6888 33.67 30.7457 33.778C30.8179 33.915 30.889 34.0499 30.969 34.1803C30.11 35.6961 29.2509 37.1973 28.3775 38.7131C28.055 39.2798 27.7325 39.8476 27.4098 40.4158C27.0594 41.0326 26.7087 41.65 26.3574 42.2672C26.3394 42.0244 26.3093 41.7795 26.2661 41.5322C25.4319 36.6695 20.1349 34.2272 16.0413 36.3964C16.2439 36.0367 16.447 35.6769 16.6514 35.3172C17.0494 34.6165 24.9986 21.7332 24.9986 21.7332Z" fill="white"/>

</svg>),
  facebook:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#0076FB"/>
<path d="M50 32.11C50 22.1081 41.9411 14 32 14C22.0589 14 14 22.1081 14 32.11C14 41.1491 20.5823 48.6414 29.1875 50V37.3449H24.6172V32.11H29.1875V28.1201C29.1875 23.5813 31.8748 21.0742 35.9864 21.0742C37.9558 21.0742 40.0156 21.4279 40.0156 21.4279V25.8847H37.7459C35.51 25.8847 34.8125 27.2808 34.8125 28.713V32.11H39.8047L39.0066 37.3449H34.8125V50C43.4177 48.6414 50 41.1491 50 32.11Z" fill="white"/>
</svg>),
  instagram:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#F00075"/>
<path d="M32 18.0627C36.5395 18.0627 37.0774 18.0799 38.8691 18.1623C40.5266 18.238 41.427 18.5142 42.026 18.748C42.8189 19.0561 43.386 19.4253 43.981 20.0203C44.576 20.6153 44.9439 21.1811 45.252 21.9753C45.4845 22.5743 45.762 23.4748 45.8378 25.1323C45.9201 26.9252 45.9374 27.4631 45.9374 32.0013C45.9374 36.5395 45.9201 37.0788 45.8378 38.8704C45.762 40.5279 45.4858 41.4284 45.252 42.0274C44.9439 42.8202 44.5747 43.3874 43.981 43.9824C43.386 44.5774 42.8203 44.9452 42.026 45.2534C41.427 45.4858 40.5266 45.7634 38.8691 45.8391C37.0761 45.9214 36.5395 45.9387 32 45.9387C27.4605 45.9387 26.9226 45.9214 25.1309 45.8391C23.4734 45.7634 22.573 45.4871 21.974 45.2534C21.1811 44.9452 20.614 44.576 20.019 43.9824C19.424 43.3874 19.0561 42.8216 18.748 42.0274C18.5155 41.4284 18.238 40.5279 18.1623 38.8704C18.0799 37.0774 18.0627 36.5395 18.0627 32.0013C18.0627 27.4631 18.0799 26.9239 18.1623 25.1323C18.238 23.4748 18.5142 22.5743 18.748 21.9753C19.0561 21.1824 19.4253 20.6153 20.019 20.0203C20.6127 19.4253 21.1798 19.0574 21.974 18.748C22.573 18.5155 23.4734 18.238 25.1309 18.1623C26.9226 18.0799 27.4605 18.0627 32 18.0627ZM32 15C27.3834 15 26.8044 15.0199 24.9915 15.1023C23.1813 15.1846 21.9461 15.4728 20.8637 15.8925C19.7454 16.3268 18.7971 16.9085 17.8528 17.8528C16.9085 18.7971 16.3268 19.7467 15.8925 20.865C15.4728 21.9461 15.1846 23.1813 15.1023 24.9915C15.0199 26.8044 15 27.3834 15 32C15 36.6166 15.0199 37.1956 15.1023 39.0085C15.1846 40.8174 15.4728 42.0539 15.8925 43.135C16.3268 44.2533 16.9085 45.2016 17.8528 46.1459C18.7984 47.0915 19.7454 47.6719 20.8637 48.1062C21.9448 48.5259 23.1813 48.8141 24.9902 48.8964C26.8044 48.9801 27.3834 49 32 49C36.6166 49 37.1956 48.9801 39.0085 48.8978C40.8174 48.8154 42.0539 48.5272 43.135 48.1075C44.2533 47.6732 45.2016 47.0915 46.1459 46.1472C47.0915 45.2016 47.6719 44.2546 48.1062 43.1363C48.5259 42.0553 48.8141 40.8188 48.8964 39.0099C48.9788 37.197 48.9987 36.6179 48.9987 32.0013C48.9987 27.3848 48.9788 26.8057 48.8964 24.9928C48.8141 23.1839 48.5259 21.9474 48.1062 20.8663C47.6719 19.748 47.0902 18.7998 46.1459 17.8555C45.2016 16.9112 44.2533 16.3268 43.135 15.8925C42.0539 15.4728 40.8174 15.1846 39.0085 15.1023C37.1956 15.0199 36.6166 15 32 15ZM32 23.2702C27.1789 23.2702 23.2702 27.1789 23.2702 32C23.2702 36.8211 27.1789 40.7298 32 40.7298C36.8211 40.7298 40.7298 36.8211 40.7298 32C40.7298 27.1789 36.8211 23.2702 32 23.2702ZM32 37.6671C28.8709 37.6671 26.3329 35.1304 26.3329 32C26.3329 28.8696 28.8696 26.3329 32 26.3329C35.1304 26.3329 37.6671 28.8696 37.6671 32C37.6671 35.1304 35.1291 37.6671 32 37.6671ZM43.1151 22.9249C43.1151 24.0512 42.2013 24.9649 41.0751 24.9649C39.9488 24.9649 39.0351 24.0512 39.0351 22.9249C39.0351 21.7987 39.9488 20.8849 41.0751 20.8849C42.2013 20.8849 43.1151 21.7987 43.1151 22.9249Z" fill="white"/>

</svg>),
  tiktok:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="black"/>
<path d="M42.0108 18.3785C39.321 15.2186 39.6866 12 39.6866 12H37.8338H37.8257H32.9499V38.5651C32.9499 39.4989 32.958 40.3994 32.6493 41.2999C32.1618 42.7423 31.1135 44.0348 29.7158 44.6101C27.6193 45.4689 25.9858 45.3771 24.0274 44.0513C23.5398 43.701 23.1172 43.276 22.7677 42.7922C22.7633 42.7898 22.7589 42.7872 22.7545 42.7848C21.849 41.519 21.6545 40.0467 21.6626 38.9234C21.8982 36.8473 22.6947 35.6882 24.1899 34.4958C26.3353 32.8867 29.0087 33.7954 29.0087 33.7954V26.8334C28.3667 26.7333 27.7166 26.6917 27.0665 26.7083V26.7C25.6038 26.7251 24.1571 27.0335 22.8083 27.6173C21.565 28.1093 20.4029 28.818 19.3789 29.7019C18.2248 30.7276 17.2416 31.9533 16.494 33.3208C16.2095 33.8211 15.1368 35.8305 15.0068 39.0907C14.9337 40.9333 15.4699 42.8512 15.73 43.6431V43.6514C15.8925 44.11 16.5262 45.7109 17.5666 47.0701C17.8672 47.4621 18.1923 47.8372 18.5337 48.1958C19.1352 48.8212 19.7934 49.3882 20.5004 49.8885C23.759 52.1482 27.3754 51.9979 27.3754 51.9979C28.0011 51.9729 30.0978 51.9979 32.4787 50.8472C35.1197 49.5715 36.6233 47.6704 36.6233 47.6704C36.8508 47.3868 38.086 45.9778 38.8825 43.8432C39.4921 42.209 39.6952 40.2495 39.6952 39.4658V25.3742C39.7766 25.4243 40.8654 26.1581 40.8654 26.1581C40.8654 26.1581 42.4337 27.1837 44.8799 27.8508C46.6352 28.326 49 28.426 49 28.426V21.6054C48.553 21.6556 47.8623 21.6054 47.0497 21.4136V21.4053C46.2615 21.2134 45.4894 20.9301 44.7663 20.5547C43.3521 19.8292 42.2553 18.6619 42.0439 18.4201L42.0108 18.3785Z" fill="white"/>

</svg>),
  youtube:(<svg viewBox="0 0 67 67" width="67" height="67" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#FF0000"/>
<path fillRule="evenodd" clipRule="evenodd" d="M46.0645 19.7758C47.613 20.2035 48.8341 21.4616 49.2473 23.0594C50 25.9571 50 32 50 32C50 32 50 38.0429 49.2473 40.9406C48.8341 42.5384 47.613 43.7965 46.0645 44.2242C43.2582 45 32 45 32 45C32 45 20.7418 45 17.9355 44.2242C16.387 43.7965 15.1659 42.5384 14.7527 40.9406C14 38.0429 14 32 14 32C14 32 14 25.9571 14.7527 23.0594C15.1659 21.4616 16.387 20.2035 17.9355 19.7758C20.7418 19 32 19 32 19C32 19 43.2582 19 46.0645 19.7758ZM38.7331 32L29.0902 37.2V26.8L38.7331 32Z" fill="white"/>

</svg>),
  linkedin:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#0077B5"/>
<path d="M41.3333 16H22.6667C18.9853 16 16 18.9853 16 22.6667V41.3333C16 45.0147 18.9853 48 22.6667 48H41.3333C45.016 48 48 45.0147 48 41.3333V22.6667C48 18.9853 45.016 16 41.3333 16ZM26.6667 41.3333H22.6667V26.6667H26.6667V41.3333ZM24.6667 24.976C23.3787 24.976 22.3333 23.9227 22.3333 22.624C22.3333 21.3253 23.3787 20.272 24.6667 20.272C25.9547 20.272 27 21.3253 27 22.624C27 23.9227 25.956 24.976 24.6667 24.976ZM42.6667 41.3333H38.6667V33.8613C38.6667 29.3707 33.3333 29.7107 33.3333 33.8613V41.3333H29.3333V26.6667H33.3333V29.02C35.1947 25.572 42.6667 25.3173 42.6667 32.3213V41.3333Z" fill="white"/>

</svg>),
  twitter:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="black"/>
<path d="M35.0443 29.3967L46.9571 15H44.1341L33.7903 27.5004L25.5287 15H16L28.4931 33.9029L16 49H18.8231L29.7464 35.7991L38.4713 49H48L35.0437 29.3967H35.0443ZM31.1777 34.0694L29.9119 32.1871L19.8403 17.2095H24.1764L32.3043 29.2969L33.5701 31.1792L44.1355 46.891H39.7994L31.1777 34.0701V34.0694Z" fill="white"/>

</svg>),
  bing:(<svg viewBox="0 0 67 67" width="67" height="67" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#FFB900"/>
<path d="M19 12L26.9963 14.8109V42.9367L38.2594 36.4396L32.7373 33.8507L29.2535 25.1862L47 31.4161V40.4735L27.0008 52L19 47.5528V12Z" fill="white"/>

</svg>),
  pinterest:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#DA162B"/>
<path d="M24.7113 50.9189C24.4916 48.998 24.3119 46.0365 24.7912 43.9355C25.2307 42.0345 27.6276 31.8494 27.6276 31.8494C27.6276 31.8494 26.9085 30.3887 26.9085 28.2476C26.9085 24.8659 28.866 22.3447 31.3028 22.3447C33.3802 22.3447 34.3789 23.9054 34.3789 25.7664C34.3789 27.8474 33.0606 30.969 32.3615 33.8704C31.7822 36.2916 33.5799 38.2726 35.9568 38.2726C40.2713 38.2726 43.587 33.7103 43.587 27.1471C43.587 21.3242 39.4124 17.2621 33.4401 17.2621C26.529 17.2621 22.4742 22.4447 22.4742 27.8074C22.4742 29.8884 23.2732 32.1296 24.2719 33.3502C24.4717 33.5903 24.4916 33.8104 24.4317 34.0505C24.2519 34.8109 23.8325 36.4717 23.7526 36.8119C23.6527 37.2521 23.393 37.3522 22.9336 37.1321C19.8976 35.7113 18 31.2891 18 27.7073C18 20.0435 23.5528 13 34.0393 13C42.4485 13 49 19.003 49 27.047C49 35.4312 43.7268 42.1746 36.4162 42.1746C33.9594 42.1746 31.6424 40.8939 30.8634 39.3732C30.8634 39.3732 29.645 44.0155 29.3454 45.1561C28.8061 47.2771 27.328 49.9184 26.3293 51.5393L25.2045 53L24.7113 50.9189Z" fill="white"/>

</svg>),
  x_organic:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="black"/>
<path d="M35.0443 29.3967L46.9571 15H44.1341L33.7903 27.5004L25.5287 15H16L28.4931 33.9029L16 49H18.8231L29.7464 35.7991L38.4713 49H48L35.0437 29.3967H35.0443ZM31.1777 34.0694L29.9119 32.1871L19.8403 17.2095H24.1764L32.3043 29.2969L33.5701 31.1792L44.1355 46.891H39.7994L31.1777 34.0701V34.0694Z" fill="white"/>

</svg>),
  reddit:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#FF4500"/>
<path d="M38.5272 39.5798C36.8904 39.5798 35.5559 38.2794 35.5559 36.6844C35.5559 35.0894 36.8904 33.789 38.5272 33.789C40.164 33.789 41.4986 35.0894 41.4986 36.6844C41.4986 38.2794 40.164 39.5798 38.5272 39.5798ZM39.0519 44.3314C37.0216 46.3043 33.1378 46.4599 31.9971 46.4599C30.8565 46.4599 26.967 46.3043 24.9424 44.3314C24.6401 44.0369 24.6401 43.5645 24.9424 43.27C25.2446 42.9754 25.7294 42.9754 26.0317 43.27C27.3092 44.5148 30.041 44.9594 31.9971 44.9594C33.9476 44.9594 36.6851 44.5148 37.9626 43.27C38.2649 42.9754 38.7497 42.9754 39.0519 43.27C39.3485 43.5645 39.3485 44.0369 39.0519 44.3314ZM22.4843 36.6844C22.4843 35.0894 23.8188 33.789 25.4557 33.789C27.0925 33.789 28.427 35.0894 28.427 36.6844C28.427 38.2794 27.0925 39.5798 25.4557 39.5798C23.8188 39.5798 22.4843 38.2794 22.4843 36.6844ZM51 33.789C51 31.5493 49.1408 29.7376 46.8424 29.7376C45.7189 29.7376 44.7037 30.1711 43.9566 30.8769C41.1165 28.8762 37.1984 27.5869 32.8355 27.4368L34.729 18.7506L40.9169 20.0344C40.991 21.5682 42.2799 22.7908 43.8711 22.7908C45.5136 22.7908 46.8424 21.496 46.8424 19.8954C46.8424 18.2949 45.5136 17 43.8711 17C42.7019 17 41.7039 17.6613 41.2191 18.6172L34.3069 17.1834C34.113 17.1445 33.9134 17.1778 33.748 17.2834C33.5826 17.389 33.4686 17.5502 33.4286 17.7391L31.3527 27.2701C31.3413 27.3257 31.3527 27.3757 31.3527 27.4313C26.9099 27.5424 22.9178 28.8373 20.032 30.8658C19.2849 30.1655 18.2754 29.7376 17.1576 29.7376C14.8592 29.7376 13 31.5549 13 33.789C13 35.434 14.0095 36.8511 15.4581 37.4847C15.3953 37.8848 15.3611 38.2961 15.3611 38.7129C15.3611 44.9483 22.8094 50 31.9971 50C41.1849 50 48.6332 44.9483 48.6332 38.7129C48.6332 38.3016 48.599 37.8959 48.5362 37.4958C49.9791 36.8622 51 35.4451 51 33.789Z" fill="white"/>

</svg>),
  pinterest_organic:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#DA162B"/>
<path d="M24.7113 50.9189C24.4916 48.998 24.3119 46.0365 24.7912 43.9355C25.2307 42.0345 27.6276 31.8494 27.6276 31.8494C27.6276 31.8494 26.9085 30.3887 26.9085 28.2476C26.9085 24.8659 28.866 22.3447 31.3028 22.3447C33.3802 22.3447 34.3789 23.9054 34.3789 25.7664C34.3789 27.8474 33.0606 30.969 32.3615 33.8704C31.7822 36.2916 33.5799 38.2726 35.9568 38.2726C40.2713 38.2726 43.587 33.7103 43.587 27.1471C43.587 21.3242 39.4124 17.2621 33.4401 17.2621C26.529 17.2621 22.4742 22.4447 22.4742 27.8074C22.4742 29.8884 23.2732 32.1296 24.2719 33.3502C24.4717 33.5903 24.4916 33.8104 24.4317 34.0505C24.2519 34.8109 23.8325 36.4717 23.7526 36.8119C23.6527 37.2521 23.393 37.3522 22.9336 37.1321C19.8976 35.7113 18 31.2891 18 27.7073C18 20.0435 23.5528 13 34.0393 13C42.4485 13 49 19.003 49 27.047C49 35.4312 43.7268 42.1746 36.4162 42.1746C33.9594 42.1746 31.6424 40.8939 30.8634 39.3732C30.8634 39.3732 29.645 44.0155 29.3454 45.1561C28.8061 47.2771 27.328 49.9184 26.3293 51.5393L25.2045 53L24.7113 50.9189Z" fill="white"/>
</svg>),
  tiktok_organic:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="black"/>
<path d="M42.0108 18.3785C39.321 15.2186 39.6866 12 39.6866 12H37.8338H37.8257H32.9499V38.5651C32.9499 39.4989 32.958 40.3994 32.6493 41.2999C32.1618 42.7423 31.1135 44.0348 29.7158 44.6101C27.6193 45.4689 25.9858 45.3771 24.0274 44.0513C23.5398 43.701 23.1172 43.276 22.7677 42.7922C22.7633 42.7898 22.7589 42.7872 22.7545 42.7848C21.849 41.519 21.6545 40.0467 21.6626 38.9234C21.8982 36.8473 22.6947 35.6882 24.1899 34.4958C26.3353 32.8867 29.0087 33.7954 29.0087 33.7954V26.8334C28.3667 26.7333 27.7166 26.6917 27.0665 26.7083V26.7C25.6038 26.7251 24.1571 27.0335 22.8083 27.6173C21.565 28.1093 20.4029 28.818 19.3789 29.7019C18.2248 30.7276 17.2416 31.9533 16.494 33.3208C16.2095 33.8211 15.1368 35.8305 15.0068 39.0907C14.9337 40.9333 15.4699 42.8512 15.73 43.6431V43.6514C15.8925 44.11 16.5262 45.7109 17.5666 47.0701C17.8672 47.4621 18.1923 47.8372 18.5337 48.1958C19.1352 48.8212 19.7934 49.3882 20.5004 49.8885C23.759 52.1482 27.3754 51.9979 27.3754 51.9979C28.0011 51.9729 30.0978 51.9979 32.4787 50.8472C35.1197 49.5715 36.6233 47.6704 36.6233 47.6704C36.8508 47.3868 38.086 45.9778 38.8825 43.8432C39.4921 42.209 39.6952 40.2495 39.6952 39.4658V25.3742C39.7766 25.4243 40.8654 26.1581 40.8654 26.1581C40.8654 26.1581 42.4337 27.1837 44.8799 27.8508C46.6352 28.326 49 28.426 49 28.426V21.6054C48.553 21.6556 47.8623 21.6054 47.0497 21.4136V21.4053C46.2615 21.2134 45.4894 20.9301 44.7663 20.5547C43.3521 19.8292 42.2553 18.6619 42.0439 18.4201L42.0108 18.3785Z" fill="white"/>
</svg>),
  reddit_organic:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#FF4500"/>
<path d="M38.5272 39.5798C36.8904 39.5798 35.5559 38.2794 35.5559 36.6844C35.5559 35.0894 36.8904 33.789 38.5272 33.789C40.164 33.789 41.4986 35.0894 41.4986 36.6844C41.4986 38.2794 40.164 39.5798 38.5272 39.5798ZM39.0519 44.3314C37.0216 46.3043 33.1378 46.4599 31.9971 46.4599C30.8565 46.4599 26.967 46.3043 24.9424 44.3314C24.6401 44.0369 24.6401 43.5645 24.9424 43.27C25.2446 42.9754 25.7294 42.9754 26.0317 43.27C27.3092 44.5148 30.041 44.9594 31.9971 44.9594C33.9476 44.9594 36.6851 44.5148 37.9626 43.27C38.2649 42.9754 38.7497 42.9754 39.0519 43.27C39.3485 43.5645 39.3485 44.0369 39.0519 44.3314ZM22.4843 36.6844C22.4843 35.0894 23.8188 33.789 25.4557 33.789C27.0925 33.789 28.427 35.0894 28.427 36.6844C28.427 38.2794 27.0925 39.5798 25.4557 39.5798C23.8188 39.5798 22.4843 38.2794 22.4843 36.6844ZM51 33.789C51 31.5493 49.1408 29.7376 46.8424 29.7376C45.7189 29.7376 44.7037 30.1711 43.9566 30.8769C41.1165 28.8762 37.1984 27.5869 32.8355 27.4368L34.729 18.7506L40.9169 20.0344C40.991 21.5682 42.2799 22.7908 43.8711 22.7908C45.5136 22.7908 46.8424 21.496 46.8424 19.8954C46.8424 18.2949 45.5136 17 43.8711 17C42.7019 17 41.7039 17.6613 41.2191 18.6172L34.3069 17.1834C34.113 17.1445 33.9134 17.1778 33.748 17.2834C33.5826 17.389 33.4686 17.5502 33.4286 17.7391L31.3527 27.2701C31.3413 27.3257 31.3527 27.3757 31.3527 27.4313C26.9099 27.5424 22.9178 28.8373 20.032 30.8658C19.2849 30.1655 18.2754 29.7376 17.1576 29.7376C14.8592 29.7376 13 31.5549 13 33.789C13 35.434 14.0095 36.8511 15.4581 37.4847C15.3953 37.8848 15.3611 38.2961 15.3611 38.7129C15.3611 44.9483 22.8094 50 31.9971 50C41.1849 50 48.6332 44.9483 48.6332 38.7129C48.6332 38.3016 48.599 37.8959 48.5362 37.4958C49.9791 36.8622 51 35.4451 51 33.789Z" fill="white"/>
</svg>),
  seo:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#16A34A"/><circle cx="10" cy="10" r="5" fill="none" stroke="white" strokeWidth="2"/><line x1="14" y1="14" x2="19" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>),
  google_search:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#4285F4"/><circle cx="10" cy="10" r="5" fill="none" stroke="white" strokeWidth="2"/><line x1="14" y1="14" x2="19" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>),
  youtube_search:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#FF0000"/><circle cx="10" cy="10" r="5" fill="none" stroke="white" strokeWidth="2"/><line x1="14" y1="14" x2="19" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>),
  bing_search:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#008373"/><circle cx="10" cy="10" r="5" fill="none" stroke="white" strokeWidth="2"/><line x1="14" y1="14" x2="19" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>),
  fb_organic:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#0076FB"/>
<path d="M50 32.11C50 22.1081 41.9411 14 32 14C22.0589 14 14 22.1081 14 32.11C14 41.1491 20.5823 48.6414 29.1875 50V37.3449H24.6172V32.11H29.1875V28.1201C29.1875 23.5813 31.8748 21.0742 35.9864 21.0742C37.9558 21.0742 40.0156 21.4279 40.0156 21.4279V25.8847H37.7459C35.51 25.8847 34.8125 27.2808 34.8125 28.713V32.11H39.8047L39.0066 37.3449H34.8125V50C43.4177 48.6414 50 41.1491 50 32.11Z" fill="white"/>

</svg>),
  ig_organic:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#F00075"/>
<path d="M32 18.0627C36.5395 18.0627 37.0774 18.0799 38.8691 18.1623C40.5266 18.238 41.427 18.5142 42.026 18.748C42.8189 19.0561 43.386 19.4253 43.981 20.0203C44.576 20.6153 44.9439 21.1811 45.252 21.9753C45.4845 22.5743 45.762 23.4748 45.8378 25.1323C45.9201 26.9252 45.9374 27.4631 45.9374 32.0013C45.9374 36.5395 45.9201 37.0788 45.8378 38.8704C45.762 40.5279 45.4858 41.4284 45.252 42.0274C44.9439 42.8202 44.5747 43.3874 43.981 43.9824C43.386 44.5774 42.8203 44.9452 42.026 45.2534C41.427 45.4858 40.5266 45.7634 38.8691 45.8391C37.0761 45.9214 36.5395 45.9387 32 45.9387C27.4605 45.9387 26.9226 45.9214 25.1309 45.8391C23.4734 45.7634 22.573 45.4871 21.974 45.2534C21.1811 44.9452 20.614 44.576 20.019 43.9824C19.424 43.3874 19.0561 42.8216 18.748 42.0274C18.5155 41.4284 18.238 40.5279 18.1623 38.8704C18.0799 37.0774 18.0627 36.5395 18.0627 32.0013C18.0627 27.4631 18.0799 26.9239 18.1623 25.1323C18.238 23.4748 18.5142 22.5743 18.748 21.9753C19.0561 21.1824 19.4253 20.6153 20.019 20.0203C20.6127 19.4253 21.1798 19.0574 21.974 18.748C22.573 18.5155 23.4734 18.238 25.1309 18.1623C26.9226 18.0799 27.4605 18.0627 32 18.0627ZM32 15C27.3834 15 26.8044 15.0199 24.9915 15.1023C23.1813 15.1846 21.9461 15.4728 20.8637 15.8925C19.7454 16.3268 18.7971 16.9085 17.8528 17.8528C16.9085 18.7971 16.3268 19.7467 15.8925 20.865C15.4728 21.9461 15.1846 23.1813 15.1023 24.9915C15.0199 26.8044 15 27.3834 15 32C15 36.6166 15.0199 37.1956 15.1023 39.0085C15.1846 40.8174 15.4728 42.0539 15.8925 43.135C16.3268 44.2533 16.9085 45.2016 17.8528 46.1459C18.7984 47.0915 19.7454 47.6719 20.8637 48.1062C21.9448 48.5259 23.1813 48.8141 24.9902 48.8964C26.8044 48.9801 27.3834 49 32 49C36.6166 49 37.1956 48.9801 39.0085 48.8978C40.8174 48.8154 42.0539 48.5272 43.135 48.1075C44.2533 47.6732 45.2016 47.0915 46.1459 46.1472C47.0915 45.2016 47.6719 44.2546 48.1062 43.1363C48.5259 42.0553 48.8141 40.8188 48.8964 39.0099C48.9788 37.197 48.9987 36.6179 48.9987 32.0013C48.9987 27.3848 48.9788 26.8057 48.8964 24.9928C48.8141 23.1839 48.5259 21.9474 48.1062 20.8663C47.6719 19.748 47.0902 18.7998 46.1459 17.8555C45.2016 16.9112 44.2533 16.3268 43.135 15.8925C42.0539 15.4728 40.8174 15.1846 39.0085 15.1023C37.1956 15.0199 36.6166 15 32 15ZM32 23.2702C27.1789 23.2702 23.2702 27.1789 23.2702 32C23.2702 36.8211 27.1789 40.7298 32 40.7298C36.8211 40.7298 40.7298 36.8211 40.7298 32C40.7298 27.1789 36.8211 23.2702 32 23.2702ZM32 37.6671C28.8709 37.6671 26.3329 35.1304 26.3329 32C26.3329 28.8696 28.8696 26.3329 32 26.3329C35.1304 26.3329 37.6671 28.8696 37.6671 32C37.6671 35.1304 35.1291 37.6671 32 37.6671ZM43.1151 22.9249C43.1151 24.0512 42.2013 24.9649 41.0751 24.9649C39.9488 24.9649 39.0351 24.0512 39.0351 22.9249C39.0351 21.7987 39.9488 20.8849 41.0751 20.8849C42.2013 20.8849 43.1151 21.7987 43.1151 22.9249Z" fill="white"/>

</svg>),
  li_organic:(<svg width="67" height="67" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="32" fill="#0077B5"/>
<path d="M41.3333 16H22.6667C18.9853 16 16 18.9853 16 22.6667V41.3333C16 45.0147 18.9853 48 22.6667 48H41.3333C45.016 48 48 45.0147 48 41.3333V22.6667C48 18.9853 45.016 16 41.3333 16ZM26.6667 41.3333H22.6667V26.6667H26.6667V41.3333ZM24.6667 24.976C23.3787 24.976 22.3333 23.9227 22.3333 22.624C22.3333 21.3253 23.3787 20.272 24.6667 20.272C25.9547 20.272 27 21.3253 27 22.624C27 23.9227 25.956 24.976 24.6667 24.976ZM42.6667 41.3333H38.6667V33.8613C38.6667 29.3707 33.3333 29.7107 33.3333 33.8613V41.3333H29.3333V26.6667H33.3333V29.02C35.1947 25.572 42.6667 25.3173 42.6667 32.3213V41.3333Z" fill="white"/>

</svg>),
  webpage:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#054547"/><rect x="5" y="7" width="14" height="10" rx="2" fill="none" stroke="white" strokeWidth="1.5"/><rect x="5" y="10" width="14" height="1" fill="white" opacity="0.5"/><rect x="7" y="12.5" width="6" height="1" rx=".5" fill="white" opacity="0.7"/></svg>),
  blog_src:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#0EA5E9"/><rect x="5" y="7" width="14" height="2" rx="1" fill="white"/><rect x="5" y="11" width="10" height="2" rx="1" fill="white"/><rect x="5" y="15" width="12" height="2" rx="1" fill="white"/></svg>),
  form:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#7C3AED"/><rect x="6" y="8" width="12" height="2" rx="1" fill="none" stroke="white" strokeWidth="1.2"/><rect x="6" y="12" width="12" height="2" rx="1" fill="none" stroke="white" strokeWidth="1.2"/><rect x="6" y="16" width="7" height="2" rx="1" fill="white"/></svg>),
  ebook:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#D97706"/><rect x="7" y="5" width="10" height="14" rx="1.5" fill="none" stroke="white" strokeWidth="1.5"/><rect x="9" y="8" width="6" height="1" rx=".5" fill="white" opacity="0.8"/><rect x="9" y="11" width="6" height="1" rx=".5" fill="white" opacity="0.8"/><rect x="9" y="14" width="4" height="1" rx=".5" fill="white" opacity="0.6"/></svg>),
  sms:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#22C55E"/><path fill="white" d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z"/></svg>),
  chatbot:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#06B6D4"/><rect x="5" y="7" width="14" height="10" rx="2" fill="none" stroke="white" strokeWidth="1.5"/><circle cx="9" cy="12" r="1" fill="white"/><circle cx="12" cy="12" r="1" fill="white"/><circle cx="15" cy="12" r="1" fill="white"/><path d="M12 17v2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  wait:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#4B5563"/><path d="M8 4h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><path d="M8 20h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><path d="M9 4v3.5l3 4-3 4V20" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 4v3.5l-3 4 3 4V20" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  achat:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#16A34A"/><rect x="4" y="7.5" width="16" height="10" rx="2" fill="none" stroke="white" strokeWidth="1.6"/><rect x="4" y="10.5" width="16" height="3" fill="white" opacity="0.35"/><rect x="6" y="15" width="4" height="1.5" rx=".75" fill="white"/><rect x="13" y="15" width="5" height="1.5" rx=".75" fill="white" opacity="0.5"/></svg>),
  form_complete:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#0EA5E9"/><rect x="6" y="5" width="12" height="14" rx="1.5" fill="none" stroke="white" strokeWidth="1.5"/><rect x="9.5" y="3.5" width="5" height="2.5" rx="1" fill="white" opacity="0.45"/><polyline points="8.5,12.5 11,15 15.5,10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  meeting_booked:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#7C3AED"/><rect x="5" y="6" width="14" height="13" rx="2" fill="none" stroke="white" strokeWidth="1.5"/><rect x="5" y="6" width="14" height="4" rx="2" fill="white" opacity="0.2"/><line x1="8" y1="4" x2="8" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="4" x2="16" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><polyline points="8.5,14 11,16.5 16,12" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  deal:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#054547"/><path d="M12 5l1.6 3.4 3.4.5-2.5 2.4.6 3.7L12 13.4l-3.1 1.6.6-3.7L7 8.9l3.4-.5z" fill="white" strokeLinejoin="round"/><line x1="9" y1="19" x2="15" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  add_list_new:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#475569"/><line x1="5" y1="8" x2="15" y2="8" stroke="white" strokeWidth="1.6" strokeLinecap="round"/><line x1="5" y1="12" x2="15" y2="12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/><line x1="5" y1="16" x2="12" y2="16" stroke="white" strokeWidth="1.6" strokeLinecap="round"/><circle cx="18.5" cy="16" r="3" fill="white" opacity="0.22"/><line x1="18.5" y1="14.5" x2="18.5" y2="17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="17" y1="16" x2="20" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  dl_pdf:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/><path d="M7 3h7l4 4v11a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" fill="#FEE2E2"/><path d="M14 3l4 4h-4V3z" fill="#FECACA"/><rect x="5.5" y="13" width="13" height="5.5" rx="1" fill="#DC2626"/><text x="12" y="17" fontSize="3.6" fontWeight="800" fill="white" textAnchor="middle" fontFamily="Arial,sans-serif" letterSpacing=".4">PDF</text></svg>),  direct:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#64748B"/><path d="M4 12h16M14 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>),
  referral:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#F97316"/><path fill="white" d="M12 4l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z"/></svg>),
  email:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#2563EB"/><rect x="4" y="8" width="16" height="11" rx="2" fill="none" stroke="white" strokeWidth="1.5"/><polyline points="4,8 12,14 20,8" stroke="white" strokeWidth="1.5" fill="none"/></svg>),
  popup:(<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="24" rx="12" fill="#EC4899"/><rect x="5" y="6" width="14" height="12" rx="2" fill="none" stroke="white" strokeWidth="1.5"/><line x1="9" y1="6" x2="9" y2="18" stroke="white" strokeWidth="1" opacity="0.4"/><rect x="9" y="9" width="8" height="6" rx="1" fill="white" opacity="0.3"/></svg>),
};


// ─── PAGE STYLES ──────────────────────────────────────────────────────────────
// thumb is a function (t: Translations) => JSX so button labels & calendar
// day abbreviations update when the language changes.
// labelKey references a key in Translations for the human-readable page name.
// ─────────────────────────────────────────────────────────────────────────────
const _BROWSER_BAR = (<><rect x="0" y="0" width="86" height="14" fill="#E8E8E8" rx="4"/><circle cx="8" cy="7" r="2.5" fill="#FF5F57"/><circle cx="15" cy="7" r="2.5" fill="#FFBD2E"/><circle cx="22" cy="7" r="2.5" fill="#28C840"/><rect x="29" y="4" width="49" height="6" rx="3" fill="#D0D0D0"/></>);
const PAGE_STYLES: {id:string; labelKey:keyof Translations; hc:string; thumb:(t:Translations)=>React.ReactElement}[] = [
  {
    id:"abonnement", labelKey:"pageAbonnement", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="22" width="70" height="2" rx="1" fill="#054547"/>
      <rect x="16" y="28" width="54" height="2.5" rx="1.5" fill="#D0D8D7"/>
      <rect x="22" y="33" width="42" height="2" rx="1" fill="#EFF7F5"/>
      <rect x="8" y="40" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="51" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="62" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="75" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="81.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaSignUp}</text>
    </svg>),
  },
  {
    id:"blog", labelKey:"pageBlog", hc:"#054547",
    thumb:(_t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="18" width="70" height="28" rx="3" fill="#EFF7F5" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="14" y="22" width="58" height="18" rx="2" fill="#D0D8D7"/>
      <polygon points="26,40 40,26 54,40" fill="#B0BCBA"/>
      <circle cx="51" cy="28" r="4" fill="#B0BCBA"/>
      <rect x="8" y="50" width="45" height="1.5" rx="0.75" fill="#054547"/>
      <rect x="8" y="56" width="70" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="60" width="60" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="64" width="65" height="2" rx="1" fill="#D0D8D7"/>
      <circle cx="13" cy="74" r="4" fill="#D0D8D7"/>
      <rect x="20" y="72" width="28" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="20" y="76" width="18" height="1.5" rx="1" fill="#EFF7F5"/>
      <circle cx="60" cy="85" r="4" fill="#D0D8D7"/>
      <rect x="47" y="83" width="28" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="47" y="87" width="18" height="1.5" rx="1" fill="#EFF7F5"/>
    </svg>),
  },
  {
    id:"calendrier", labelKey:"pageCalendrier", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#F8FAFA" rx="4"/>
      {_BROWSER_BAR}
      <rect x="6" y="17" width="74" height="88" rx="5" fill="white"/>
      <rect x="6" y="17" width="74" height="12" rx="5" fill="#054547"/>
      <rect x="11" y="19.5" width="20" height="2.5" rx="1.2" fill="rgba(255,255,255,0.85)"/>
      <text x="72" y="24.5" fontSize="6" fill="rgba(255,255,255,0.65)" textAnchor="middle">{"‹›"}</text>
      <rect x="6" y="29" width="74" height="7" fill="#EFF7F5"/>
      <text x="11"   y="34" fontSize="4" fill="#054547" textAnchor="middle" fontWeight="600">{t.calDays[0]}</text>
      <text x="21.5" y="34" fontSize="4" fill="#054547" textAnchor="middle" fontWeight="600">{t.calDays[1]}</text>
      <text x="32"   y="34" fontSize="4" fill="#054547" textAnchor="middle" fontWeight="600">{t.calDays[2]}</text>
      <text x="42.5" y="34" fontSize="4" fill="#054547" textAnchor="middle" fontWeight="600">{t.calDays[3]}</text>
      <text x="53"   y="34" fontSize="4" fill="#054547" textAnchor="middle" fontWeight="600">{t.calDays[4]}</text>
      <text x="63.5" y="34" fontSize="4" fill="#054547" textAnchor="middle" fontWeight="600">{t.calDays[5]}</text>
      <text x="74"   y="34" fontSize="4" fill="#054547" textAnchor="middle" fontWeight="600">{t.calDays[6]}</text>
      <line x1="6" y1="39" x2="80" y2="39" stroke="#EFF7F5" strokeWidth="0.5"/>
      <line x1="6" y1="48" x2="80" y2="48" stroke="#EFF7F5" strokeWidth="0.5"/>
      <line x1="6" y1="57" x2="80" y2="57" stroke="#EFF7F5" strokeWidth="0.5"/>
      <line x1="6" y1="66" x2="80" y2="66" stroke="#EFF7F5" strokeWidth="0.5"/>
      <line x1="6" y1="75" x2="80" y2="75" stroke="#EFF7F5" strokeWidth="0.5"/>
      <text x="11"   y="45" fontSize="5" fill="#B0C4C3" textAnchor="middle">1</text>
      <text x="21.5" y="52" fontSize="5" fill="#054547" textAnchor="middle">2</text>
      <text x="32"   y="52" fontSize="5" fill="#054547" textAnchor="middle">3</text>
      <text x="42.5" y="52" fontSize="5" fill="#054547" textAnchor="middle">4</text>
      <text x="53"   y="52" fontSize="5" fill="#054547" textAnchor="middle">5</text>
      <text x="63.5" y="52" fontSize="5" fill="#054547" textAnchor="middle">6</text>
      <text x="74"   y="52" fontSize="5" fill="#B0C4C3" textAnchor="middle">7</text>
      <text x="11"   y="54" fontSize="5" fill="#B0C4C3" textAnchor="middle">8</text>
      <text x="21.5" y="61" fontSize="5" fill="#054547" textAnchor="middle">9</text>
      <text x="32"   y="61" fontSize="5" fill="#054547" textAnchor="middle">10</text>
      <text x="42.5" y="61" fontSize="5" fill="#054547" textAnchor="middle">11</text>
      <rect x="48" y="49.5" width="10" height="8" rx="2" fill="#EFF7F5"/>
      <text x="53"   y="61" fontSize="5" fill="#054547" textAnchor="middle" fontWeight="700">12</text>
      <text x="63.5" y="61" fontSize="5" fill="#054547" textAnchor="middle">13</text>
      <text x="74"   y="61" fontSize="5" fill="#B0C4C3" textAnchor="middle">14</text>
      <text x="11"   y="63" fontSize="5" fill="#B0C4C3" textAnchor="middle">15</text>
      <text x="21.5" y="70" fontSize="5" fill="#054547" textAnchor="middle">16</text>
      <circle cx="32" cy="61.5" r="5" fill="#054547"/>
      <text x="32"   y="63.5" fontSize="5" fill="white" textAnchor="middle" fontWeight="700">17</text>
      <text x="42.5" y="70" fontSize="5" fill="#054547" textAnchor="middle">18</text>
      <rect x="48" y="58.5" width="10" height="8" rx="2" fill="#EFF7F5"/>
      <text x="53"   y="70" fontSize="5" fill="#054547" textAnchor="middle" fontWeight="700">19</text>
      <text x="63.5" y="70" fontSize="5" fill="#054547" textAnchor="middle">20</text>
      <text x="74"   y="70" fontSize="5" fill="#B0C4C3" textAnchor="middle">21</text>
      <text x="11"   y="72" fontSize="5" fill="#B0C4C3" textAnchor="middle">22</text>
      <text x="21.5" y="79" fontSize="5" fill="#054547" textAnchor="middle">23</text>
      <text x="32"   y="79" fontSize="5" fill="#054547" textAnchor="middle">24</text>
      <rect x="37.5" y="67.5" width="10" height="8" rx="2" fill="#EFF7F5"/>
      <text x="42.5" y="79" fontSize="5" fill="#054547" textAnchor="middle" fontWeight="700">25</text>
      <text x="53"   y="79" fontSize="5" fill="#054547" textAnchor="middle">26</text>
      <text x="63.5" y="79" fontSize="5" fill="#054547" textAnchor="middle">27</text>
      <text x="74"   y="79" fontSize="5" fill="#B0C4C3" textAnchor="middle">28</text>
      <text x="11"   y="81" fontSize="5" fill="#B0C4C3" textAnchor="middle">29</text>
      <text x="21.5" y="88" fontSize="5" fill="#054547" textAnchor="middle">30</text>
      <text x="32"   y="88" fontSize="5" fill="#054547" textAnchor="middle">31</text>
      <rect x="8" y="90" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="96.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaBook}</text>
    </svg>),
  },
  {
    id:"commande", labelKey:"pageCommande", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="18" width="35" height="22" rx="2" fill="#EFF7F5" stroke="#D0D8D7" strokeWidth="1"/>
      <circle cx="20" cy="27" r="5" fill="#D0D8D7"/>
      <rect x="27" y="20" width="12" height="2" rx="1" fill="#054547"/>
      <rect x="27" y="24" width="10" height="1.5" rx="1" fill="#D0D8D7"/>
      <rect x="27" y="28" width="8" height="1.5" rx="1" fill="#E9C92B"/>
      <rect x="46" y="18" width="30" height="2.5" rx="1.5" fill="#054547"/>
      <rect x="46" y="23" width="30" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="46" y="27" width="22" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="44" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="55" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="66" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="78" width="7" height="7" rx="1.5" fill="#EFF7F5" stroke="#054547" strokeWidth="1"/>
      <rect x="18" y="80" width="40" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="90" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="96.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaBuy}</text>
    </svg>),
  },
  {
    id:"membres", labelKey:"pageMembers", hc:"#054547",
    thumb:(_t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="19" width="70" height="1.5" rx="0.75" fill="#054547"/>
      <rect x="8" y="25" width="50" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="30" width="70" height="26" rx="3" fill="#EFF7F5" stroke="#D0D8D7" strokeWidth="1"/>
      <circle cx="43" cy="40" r="7" fill="#D0D8D7"/>
      <circle cx="43" cy="37" r="3" fill="#B0BCBA"/>
      <path d="M36 48 Q43 44 50 48" stroke="#B0BCBA" strokeWidth="1.5" fill="none"/>
      <rect x="8"  y="61" width="6" height="6" rx="1.5" fill="#054547" opacity="0.3"/>
      <rect x="17" y="63" width="40" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="71" width="6" height="6" rx="1.5" fill="#054547" opacity="0.3"/>
      <rect x="17" y="73" width="50" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="81" width="6" height="6" rx="1.5" fill="#054547" opacity="0.3"/>
      <rect x="17" y="83" width="35" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="91" width="6" height="6" rx="1.5" fill="#054547" opacity="0.3"/>
      <rect x="17" y="93" width="45" height="2" rx="1" fill="#D0D8D7"/>
    </svg>),
  },
  {
    id:"remerciement", labelKey:"pageRemerciement", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <circle cx="43" cy="36" r="14" fill="#EFF7F5" stroke="#054547" strokeWidth="1.5"/>
      <polyline points="36,36 41,42 51,29" stroke="#054547" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="12" y="56" width="62" height="1.5" rx="0.75" fill="#054547"/>
      <rect x="14" y="63" width="58" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="18" y="67" width="50" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="22" y="71" width="42" height="2" rx="1" fill="#EFF7F5"/>
      <rect x="8" y="78" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="91" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="97.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaThanks}</text>
    </svg>),
  },
  {
    id:"sondage", labelKey:"pageSondage", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="19" width="70" height="1.5" rx="0.75" fill="#054547"/>
      <rect x="8" y="26" width="50" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="33" width="6" height="6" rx="1.5" fill="#E9C92B"/>
      <rect x="17" y="34.5" width="34" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="43" width="6" height="6" rx="1.5" fill="#EFF7F5" stroke="#054547" strokeWidth="1"/>
      <rect x="17" y="44.5" width="38" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="53" width="6" height="6" rx="1.5" fill="#EFF7F5" stroke="#054547" strokeWidth="1"/>
      <rect x="17" y="54.5" width="30" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="63" width="6" height="6" rx="1.5" fill="#EFF7F5" stroke="#054547" strokeWidth="1"/>
      <rect x="17" y="64.5" width="42" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8"  y="73" width="6" height="6" rx="1.5" fill="#EFF7F5" stroke="#054547" strokeWidth="1"/>
      <rect x="17" y="74.5" width="36" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="85" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="91.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaDownload}</text>
    </svg>),
  },
  {
    id:"telechargement", labelKey:"pageTelechargement", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <circle cx="43" cy="36" r="14" fill="#EFF7F5" stroke="#054547" strokeWidth="1.5"/>
      <line x1="43" y1="27" x2="43" y2="38" stroke="#054547" strokeWidth="2.5" strokeLinecap="round"/>
      <polyline points="36,34 43,41 50,34" stroke="#054547" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="36" y1="43" x2="50" y2="43" stroke="#054547" strokeWidth="2" strokeLinecap="round"/>
      <rect x="12" y="57" width="62" height="1.5" rx="0.75" fill="#054547"/>
      <rect x="14" y="64" width="58" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="18" y="68" width="50" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="75" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="85" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="91.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaDownload}</text>
    </svg>),
  },
  {
    id:"vente_video", labelKey:"pageVenteVideo", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="18" width="70" height="34" rx="3" fill="#054547"/>
      <circle cx="43" cy="35" r="9" fill="rgba(255,255,255,0.15)"/>
      <polygon points="40,30 40,40 50,35" fill="#E9C92B"/>
      <rect x="8" y="56" width="70" height="2.5" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="61" width="55" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="68" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="79" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="92" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="98.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaBuy}</text>
    </svg>),
  },
  {
    id:"vente", labelKey:"pageVente", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="18" width="70" height="28" rx="3" fill="#EFF7F5" stroke="#D0D8D7" strokeWidth="1"/>
      <polygon points="26,46 43,24 60,46" fill="#D0D8D7"/>
      <circle cx="57" cy="28" r="5" fill="#D0D8D7"/>
      <rect x="8" y="50" width="70" height="1.5" rx="0.75" fill="#054547"/>
      <rect x="8" y="55" width="55" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="59" width="65" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="65" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="76" width="70" height="8" rx="2" fill="white" stroke="#D0D8D7" strokeWidth="1"/>
      <rect x="8" y="89" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="95.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaBuy}</text>
    </svg>),
  },
  {
    id:"webinaire", labelKey:"pageWebinaire", hc:"#054547",
    thumb:(_t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="18" width="32" height="24" rx="2" fill="#EFF7F5" stroke="#D0D8D7" strokeWidth="1"/>
      <circle cx="24" cy="27" r="6" fill="#D0D8D7"/>
      <circle cx="24" cy="24" r="2.5" fill="#B0BCBA"/>
      <path d="M18 33 Q24 29 30 33" stroke="#B0BCBA" strokeWidth="1.5" fill="none"/>
      <rect x="42" y="18" width="36" height="24" rx="2" fill="#054547"/>
      <rect x="46" y="22" width="28" height="13" rx="1" fill="rgba(255,255,255,0.08)"/>
      <polygon points="56,26 56,32 62,29" fill="#E9C92B"/>
      <rect x="8" y="46" width="40" height="3" rx="1.5" fill="#054547"/>
      <rect x="8" y="52" width="70" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="56" width="60" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="60" width="65" height="2" rx="1" fill="#D0D8D7"/>
      <circle cx="14" cy="70" r="4" fill="#D0D8D7"/>
      <rect x="21" y="68" width="25" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="21" y="72" width="18" height="1.5" rx="1" fill="#EFF7F5"/>
      <circle cx="55" cy="80" r="4" fill="#D0D8D7"/>
      <rect x="62" y="78" width="16" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="62" y="82" width="12" height="1.5" rx="1" fill="#EFF7F5"/>
      <circle cx="14" cy="90" r="4" fill="#D0D8D7"/>
      <rect x="21" y="88" width="25" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="21" y="92" width="18" height="1.5" rx="1" fill="#EFF7F5"/>
    </svg>),
  },
  {
    id:"upsell", labelKey:"pageUpsell", hc:"#054547",
    thumb:(t)=>(<svg viewBox="0 0 86 108" width="86" height="108" xmlns="http://www.w3.org/2000/svg">
      <rect width="86" height="108" fill="#FFFFFF" rx="4"/>
      {_BROWSER_BAR}
      <rect x="8" y="19" width="70" height="1.5" rx="0.75" fill="#054547"/>
      <rect x="16" y="25" width="54" height="2" rx="1" fill="#D0D8D7"/>
      <rect x="8" y="31" width="70" height="30" rx="3" fill="#054547"/>
      <circle cx="43" cy="46" r="9" fill="rgba(255,255,255,0.12)"/>
      <polygon points="40,41 40,51 50,46" fill="#E9C92B"/>
      <rect x="8" y="66" width="70" height="12" rx="3" fill="#E9C92B"/>
      <text x="43" y="72.0" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{t.ctaBuy}</text>
      <rect x="22" y="84" width="42" height="2" rx="1" fill="#D0D8D7"/>
    </svg>),
  },
];

const ND=[
  // ── SOURCES › Payantes ──
  {type:"facebook",      labelKey:"nodeFbAds",        label:"Publicité Facebook",    cat:"src_payant",  subcat:"Payantes",            bg:"#1877F2",fg:"#fff",sh:"circle"},
  {type:"instagram",     labelKey:"nodeIgAds",         label:"Publicité Instagram",   cat:"src_payant",  subcat:"Payantes",            bg:"#E1306C",fg:"#fff",sh:"circle"},
  {type:"google",        labelKey:"nodeGoogleAds",     label:"Publicité Google",      cat:"src_payant",  subcat:"Payantes",            bg:"#34A853",fg:"#fff",sh:"circle"},
  {type:"twitter",       labelKey:"nodeTwitterAds",    label:"Publicité X",           cat:"src_payant",  subcat:"Payantes",            bg:"#000",   fg:"#fff",sh:"circle"},
  {type:"youtube",       labelKey:"nodeYoutubeAds",    label:"Publicité YouTube",     cat:"src_payant",  subcat:"Payantes",            bg:"#FF0000",fg:"#fff",sh:"circle"},
  {type:"linkedin",      labelKey:"nodeLinkedinAds",   label:"Publicité LinkedIn",    cat:"src_payant",  subcat:"Payantes",            bg:"#0A66C2",fg:"#fff",sh:"circle"},
  {type:"reddit",        labelKey:"nodeRedditAds",     label:"Publicité Reddit",      cat:"src_payant",  subcat:"Payantes",            bg:"#FF4500",fg:"#fff",sh:"circle"},
  {type:"tiktok",        labelKey:"nodeTiktokAds",     label:"Publicité TikTok",      cat:"src_payant",  subcat:"Payantes",            bg:"#000",   fg:"#fff",sh:"circle"},
  {type:"pinterest",     labelKey:"nodePinterestAds",  label:"Publicité Pinterest",   cat:"src_payant",  subcat:"Payantes",            bg:"#DA162B",fg:"#fff",sh:"circle"},
  {type:"bing",          labelKey:"nodeBingAds",       label:"Publicité Bing",        cat:"src_payant",  subcat:"Payantes",            bg:"#FFB900",fg:"#fff",sh:"circle"},
  // ── SOURCES › Moteur de recherche ──
  {type:"seo",           labelKey:"nodeSeo",           label:"Tous les moteurs",      cat:"src_search",  subcat:"Moteur de recherche", bg:"#16A34A",fg:"#fff",sh:"circle"},
  {type:"bing_search",   labelKey:"nodeBingSearch",    label:"Bing",                  cat:"src_search",  subcat:"Moteur de recherche", bg:"#008373",fg:"#fff",sh:"circle"},
  {type:"google_search", labelKey:"nodeGoogleSearch",  label:"Google",                cat:"src_search",  subcat:"Moteur de recherche", bg:"#4285F4",fg:"#fff",sh:"circle"},
  {type:"youtube_search",labelKey:"nodeYoutubeSearch", label:"YouTube",               cat:"src_search",  subcat:"Moteur de recherche", bg:"#FF0000",fg:"#fff",sh:"circle"},
  // ── SOURCES › Média sociaux ──
  {type:"fb_organic",        labelKey:"nodeFbOrganic",        label:"Publication Facebook",    cat:"src_social",  subcat:"Média sociaux",       bg:"#0076FB",fg:"#fff",sh:"circle"},
  {type:"ig_organic",        labelKey:"nodeIgOrganic",        label:"Publication Instagram",   cat:"src_social",  subcat:"Média sociaux",       bg:"#F00075",fg:"#fff",sh:"circle"},
  {type:"li_organic",        labelKey:"nodeLiOrganic",        label:"Publication LinkedIn",    cat:"src_social",  subcat:"Média sociaux",       bg:"#0077B5",fg:"#fff",sh:"circle"},
  {type:"x_organic",         labelKey:"nodeXOrganic",         label:"Publication X",           cat:"src_social",  subcat:"Média sociaux",       bg:"#000",   fg:"#fff",sh:"circle"},
  {type:"pinterest_organic", labelKey:"nodePinterestOrganic", label:"Publication Pinterest",   cat:"src_social",  subcat:"Média sociaux",       bg:"#DA162B",fg:"#fff",sh:"circle"},
  {type:"tiktok_organic",    labelKey:"nodeTiktokOrganic",    label:"Publication TikTok",      cat:"src_social",  subcat:"Média sociaux",       bg:"#000",   fg:"#fff",sh:"circle"},
  {type:"reddit_organic",    labelKey:"nodeRedditOrganic",    label:"Publication Reddit",      cat:"src_social",  subcat:"Média sociaux",       bg:"#FF4500",fg:"#fff",sh:"circle"},
  // ── SOURCES › Site Web ──
  {type:"webpage",       labelKey:"nodeWebpage",       label:"Page Web",              cat:"src_web",     subcat:"Site Web",            bg:"#054547",fg:"#fff",sh:"circle"},
  {type:"blog_src",      labelKey:"nodeBlogSrc",       label:"Blog sur le Site Web",  cat:"src_web",     subcat:"Site Web",            bg:"#0EA5E9",fg:"#fff",sh:"circle"},
  {type:"popup",         labelKey:"nodePopup",         label:"Pop-up sur le Site Web",cat:"src_web",     subcat:"Site Web",            bg:"#EC4899",fg:"#fff",sh:"circle"},
  {type:"form",          labelKey:"nodeFormSrc",       label:"Formulaire sur le Site Web",cat:"src_web", subcat:"Site Web",            bg:"#7C3AED",fg:"#fff",sh:"circle"},
  // ── SOURCES › Autres ──
  {type:"email",         labelKey:"nodeEmail",         label:"Email",                 cat:"src_autres",  subcat:"Autres",              bg:"#2563EB",fg:"#fff",sh:"circle"},
  {type:"ebook",         labelKey:"nodeEbook",         label:"Ebook (PDF)",           cat:"src_autres",  subcat:"Autres",              bg:"#D97706",fg:"#fff",sh:"circle"},
  {type:"direct",        labelKey:"nodeDirect",        label:"Direct",                cat:"src_autres",  subcat:"Autres",              bg:"#64748B",fg:"#fff",sh:"circle"},
  // ── SOURCES › Messages ──
  {type:"sms",           labelKey:"nodeSms",           label:"SMS",                   cat:"src_msg",     subcat:"Messages",            bg:"#22C55E",fg:"#fff",sh:"circle"},
  {type:"chatbot",       labelKey:"nodeChatbot",       label:"Chatbot",               cat:"src_msg",     subcat:"Messages",            bg:"#06B6D4",fg:"#fff",sh:"circle"},
  // ── PAGES ──
  {type:"page",          labelKey:"nodeAddPage",       label:"Ajouter une page",      cat:"page",        hc:"#054547",sh:"browser"},
  // ── ACTIONS › Délais ──
  {type:"wait",          labelKey:"nodeWait",          label:"Délai / Attente",       cat:"act_delai",   subcat:"Délais",              bg:"#374151",fg:"#fff",icon:"⏰",sh:"circle"},
  // ── ACTIONS › Conversions ──
  {type:"achat",         labelKey:"nodePurchase",      label:"Achat",                 cat:"act_conv",    subcat:"Conversions",         bg:"#16A34A",fg:"#fff",sh:"diamond"},
  {type:"form_complete", labelKey:"nodeFormComplete",  label:"Formulaire complété",   cat:"act_conv",    subcat:"Conversions",         bg:"#0EA5E9",fg:"#fff",sh:"diamond"},
  {type:"meeting_booked",labelKey:"nodeMeetingBooked", label:"Meeting cédulé",        cat:"act_conv",    subcat:"Conversions",         bg:"#7C3AED",fg:"#fff",sh:"diamond"},
  {type:"deal",          labelKey:"nodeDeal",          label:"Accord conclu",         cat:"act_conv",    subcat:"Conversions",         bg:"#054547",fg:"#fff",sh:"diamond"},
  // ── ACTIONS › Autres ──
  {type:"add_list_new",  labelKey:"nodeAddList",       label:"Ajouter à une liste",   cat:"act_autres",  subcat:"Autres actions",      bg:"#1E293B",fg:"#fff",sh:"diamond"},
  {type:"dl_pdf",        labelKey:"nodeDownloadPdf",   label:"Télécharger PDF",       cat:"act_autres",  subcat:"Autres actions",      bg:"#fff",fg:"#EB5757",borderColor:"#EB5757",sh:"diamond"},
  // ── TEXTE ──
  {type:"textbox",       labelKey:"nodeTextbox",       label:"Zone de texte",         cat:"text",        sh:"textbox"},
];

// Sidebar structure: 3 main sections with flat subcategory separators
const SIDEBAR_SECTIONS=[
  {
    key:"sources", sectionKey:"secSources", label:"🌐 Sources", icon:"🌐",
    cats:[
      {k:"src_payant",  subKey:"subPaid",     sub:"Payantes"},
      {k:"src_search",  subKey:"subSearch",   sub:"Moteur de recherche"},
      {k:"src_social",  subKey:"subSocial",   sub:"Médias sociaux"},
      {k:"src_web",     subKey:"subWeb",      sub:"Site Web"},
      {k:"src_autres",  subKey:"subSrcOther", sub:"Autres"},
      {k:"src_msg",     subKey:"subMessages", sub:"Messages"},
    ]
  },
  {
    key:"pages", sectionKey:"secPages", label:"📄 Pages", icon:"📄",
    cats:[{k:"page", subKey:null, sub:null}]
  },
  {
    key:"actions", sectionKey:"secActions", label:"⚡ Actions", icon:"⚡",
    cats:[
      {k:"act_delai",  subKey:"subDelay", sub:"Délais"},
      {k:"act_conv",   subKey:"subConv",  sub:"Conversions"},
      {k:"act_autres", subKey:"subOther", sub:"Autres actions"},
    ]
  },
  {
    key:"text", sectionKey:"secText", label:"📝 Texte", icon:"📝",
    cats:[{k:"text", subKey:null, sub:null}]
  },
];

// Keep CATS for backward compat (used in getSD etc)
const CATS=SIDEBAR_SECTIONS.flatMap(s=>s.cats.map(c=>({k:c.k,l:c.sub||s.label})));


const BRIEF0={campagne:"",site:"",objectif:"",dateDebut:"",dateFin:"",annonce:"",publicCible:"",region:"",tonalite:"",leadMagnet:"",sources:[""],notes:""};

let _n=100;const uid=()=>`n${_n++}`;
let _c=100;const cuid=()=>`c${_c++}`;
const gd=t=>ND.find(d=>d.type===t)||ND[0];

const getPageStyle=(node)=>{
  const styleId=node?.pageStyle||"abonnement";
  return PAGE_STYLES.find(s=>s.id===styleId)||PAGE_STYLES[0];
};

const gs=(d,n)=>{
  if(!d)return{w:70,h:70};
  if(d.sh==="textbox")return{w:n?.width||200,h:n?.height||80};
  // All node types now support custom size via nodeW/nodeH
  if(d.sh==="browser")return{w:n?.nodeW||150,h:n?.nodeH||190};
  if(d.sh==="diamond")return{w:n?.nodeW||72,h:n?.nodeH||72};
  return{w:n?.nodeW||70,h:n?.nodeH||70};
};
const getDL_unused=null; // moved inside App component
const fmtDate=iso=>{try{return new Date(iso).toLocaleString("fr-CA",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});}catch{return iso;}};

function edgePt(node,angle){
  const d=gd(node.type),{w,h}=gs(d,node);
  const cx=node.x+w/2,cy=node.y+h/2,hw=w/2-3,hh=h/2-3;
  if(d.sh==="circle"){const r=32;return{x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)};}
  const co=Math.cos(angle),si=Math.sin(angle);
  if(co===0)return{x:cx,y:cy+(si>0?hh:-hh)};
  if(si===0)return{x:cx+(co>0?hw:-hw),y:cy};
  if(Math.abs(co)*hh>Math.abs(si)*hw){const s=co>0?hw:-hw;return{x:cx+s,y:cy+s*(si/co)};}
  const s=si>0?hh:-hh;return{x:cx+s*(co/si),y:cy+s};
}

function BrowserNode({node,sel,cs,cm,w,h,t}){
  const ps=getPageStyle(node);
  const shadow=cs?"0 0 0 3px #F59E0B,0 0 16px rgba(245,158,11,.5)":sel?"0 0 0 3px #3B82F6,0 0 14px rgba(59,130,246,.4)":"0 2px 10px rgba(0,0,0,.18)";
  const bdr=cs?"2px solid #F59E0B":sel?"2px solid #3B82F6":"1.5px solid #CBD5E1";
  // Scale SVG content via CSS transform so everything (chrome bar, content) stays proportional
  // Base size is 86×108. Scale to fit width, let height follow.
  const scaleX = w / 86;
  const scaleY = h / 108;
  return(
    <div style={{width:w,height:h,background:"#fff",border:bdr,borderRadius:8,overflow:"hidden",boxShadow:shadow,cursor:cm?"crosshair":"move",userSelect:"none",position:"relative"}}>
      <div style={{
        position:"absolute",top:0,left:0,
        width:86,height:108,
        transform:`scale(${scaleX},${scaleY})`,
        transformOrigin:"top left",
      }}>
        {ps.thumb(t)}
      </div>
    </div>
  );
}

function NShape({d,node,sel,cs,cm,w,h,t}){
  if(d.sh==="browser") return <BrowserNode node={node} sel={sel} cs={cs} cm={cm} w={w} h={h} t={t}/>;
  const shadow=cs?"0 0 0 3px #F59E0B,0 0 16px rgba(245,158,11,.5)":sel?"0 0 0 3px #3B82F6,0 0 14px rgba(59,130,246,.4)":"0 2px 10px rgba(0,0,0,.18)";
  const bdr=cs?"2px solid #F59E0B":sel?"2px solid #3B82F6":null;
  if(d.sh==="diamond"){
    const dScale=Math.min(w,h)/72;
    const dSize=Math.round(50*dScale);
    const dFont=Math.round(19*dScale);
    const dLogoSize=Math.round(dSize*0.55);
    const dLogo=LOGOS[d.type]?React.cloneElement(LOGOS[d.type],{width:dLogoSize,height:dLogoSize,style:{display:"block",flexShrink:0}}):null;
    const diamondBorder=bdr||(d.borderColor?`2px solid ${d.borderColor}`:"none");
    return(
      <div style={{width:w,height:h,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:cm?"crosshair":"move",userSelect:"none"}}>
        <div style={{width:dSize,height:dSize,background:d.bg||"#1E293B",transform:"rotate(45deg)",borderRadius:4,boxShadow:shadow,border:diamondBorder}}/>
        <div style={{position:"absolute",top:0,left:0,width:w,height:h,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          {dLogo||<span style={{color:d.fg||"#fff",fontSize:dFont,fontWeight:800}}>{d.icon}</span>}
        </div>
      </div>
    );
  }
  const iconScale=Math.min(w,h)/70;
  const scaledFont=d.icon&&d.icon.length>1?Math.round(11*iconScale):Math.round(22*iconScale);
  const hasBadge=d.cat==="src_payant";
  const baseSize=Math.min(w,h);
  const badgeSize=Math.max(16,Math.round(baseSize*0.34));
  const logoEl=LOGOS[d.type]?React.cloneElement(LOGOS[d.type],{width:w,height:h,style:{display:"block"}}):null;
  // Wrapper is bigger than circle so badge sits fully outside the clipped area
  const pad=hasBadge?Math.round(badgeSize*0.4):0;
  return(
    <div style={{width:w+pad,height:h+pad,position:"relative",flexShrink:0}}>
      {/* The circle itself, no overflow on wrapper */}
      <div style={{width:w,height:h,borderRadius:"50%",overflow:"hidden",background:d.bg||"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:shadow,border:`3px solid ${cs?"#F59E0B":sel?"#fff":"transparent"}`,cursor:cm?"crosshair":"move",userSelect:"none",color:d.fg||"#fff",fontSize:scaledFont,fontWeight:700}}>
        {logoEl||d.icon}
      </div>
      {/* Badge: positioned outside circle, no clipping */}
      {hasBadge&&<div style={{position:"absolute",bottom:2,right:2,width:badgeSize,height:badgeSize,borderRadius:"50%",background:d.bg||"#2563EB",border:"3px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(badgeSize*0.55),fontWeight:900,color:"#fff",lineHeight:1,pointerEvents:"none",zIndex:10,boxShadow:"0 1px 4px rgba(0,0,0,.25)"}}>$</div>}
    </div>
  );
}

function AlignIcon({type}){
  const x1s=type==="left"?[0,0]:type==="center"?[3,2]:[6,4];
  const x2s=type==="left"?[13,11]:type==="center"?[13,14]:[16,16];
  return(<svg width="16" height="12" viewBox="0 0 16 12"><line x1={0} y1={2} x2={16} y2={2} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1={x1s[0]} y1={6} x2={x2s[0]} y2={6} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1={x1s[1]} y1={10} x2={x2s[1]} y2={10} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
}
function Toggle({on,onChange}){return(<div onClick={onChange} style={{width:42,height:24,borderRadius:12,background:on?"#2563EB":"#D1D5DB",cursor:"pointer",position:"relative",flexShrink:0,transition:"background .2s"}}><div style={{position:"absolute",top:3,left:on?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/></div>);}
function ColorPicker({value,onChange,size=38}){return(<div style={{width:size,height:size-2,borderRadius:6,border:"1px solid #334155",overflow:"hidden",background:"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><input type="color" value={value} onChange={onChange} style={{width:size-8,height:size-10,border:"none",cursor:"pointer",background:"transparent",padding:0}}/></div>);}
const SH=({children})=><div style={{fontSize:9.5,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:.8,marginBottom:6,marginTop:4}}>{children}</div>;
const ActBtn=({onClick,icon,label,disabled})=>(<button onClick={onClick} disabled={disabled} style={{flex:1,background:disabled?"#0F172A":"#1E3A5F",border:`1px solid ${disabled?"#E5E7EB":"#2563EB"}`,color:disabled?"#475569":"#fff",borderRadius:6,padding:"7px 4px",cursor:disabled?"not-allowed":"pointer",fontSize:11,fontWeight:600,display:"flex",flexDirection:"column",alignItems:"center",gap:3,opacity:disabled?0.5:1}}><span style={{fontSize:16}}>{icon}</span><span style={{fontSize:9,lineHeight:1.2,textAlign:"center"}}>{label}</span></button>);
const LayerBtn=({onClick,icon,label,kbd})=>(<button onClick={onClick} title={`${label} (${kbd})`} style={{flex:1,background:"#F8FAFC",border:"1px solid #1E2D40",color:"#374151",borderRadius:5,padding:"5px 2px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}} onMouseEnter={e=>e.currentTarget.style.background="#E5E7EB"} onMouseLeave={e=>e.currentTarget.style.background="#0F172A"}><span style={{fontSize:13}}>{icon}</span><span style={{fontSize:8,lineHeight:1.2,textAlign:"center",color:"#6B7280"}}>{label}</span><span style={{fontSize:7,color:"#9CA3AF"}}>{kbd}</span></button>);

export default function App(){
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();

  // getDL inside component so it can access t for translated node labels
  const getDL=(type:string,cl:Record<string,string>)=>cl[type]||(t as any)[gd(type)?.labelKey]||gd(type)?.label||type;

  const [nodes,setNodes]=useState([]);
  const [conns,setConns]=useState([]);
  const [past,setPast]=useState([]);
  const [future,setFuture]=useState([]);
  const [selN,setSelN]=useState([]);
  const [selC,setSelC]=useState(null);
  const [clipboard,setClipboard]=useState([]);
  const [editingTextId,setEditingTextId]=useState(null);
  const [connMode,setConnMode]=useState(false);
  const [connFrom,setConnFrom]=useState(null);
  const [connectAllMode,setConnectAllMode]=useState(false);
  const [connDash,setConnDash]=useState(false);
  const [connCurved,setConnCurved]=useState(true);
  const [dragMidConn,setDragMidConn]=useState(null);
  const [newConnColor,setNewConnColor]=useState("#94A3B8");
  const [pan,setPan]=useState({x:80,y:50});
  const [zoom,setZoom]=useState(0.8);
  const [zoomInput,setZoomInput]=useState(null); // null=display mode, string=editing mode
  const [sidebarW,setSidebarW]=useState(210);
  const [brief,setBrief]=useState(BRIEF0);
  const [briefInitial,setBriefInitial]=useState("");
  const [generating,setGenerating]=useState(false);
  const [genMsg,setGenMsg]=useState<{type:string,text:string}|null>(null);
  const [showBrief,setShowBrief]=useState(false);
  const [campName,setCampName]=useState("Nouvelle Campagne");
  const [campaigns,setCampaigns]=useState<{id:string,name:string,nodes?:any[],conns?:any[],campName?:string}[]>([{id:"camp1",name:"Nouvelle Campagne"}]);
  const [activeCampId,setActiveCampId]=useState("camp1");
  const [showCampMenu,setShowCampMenu]=useState(false);
  const [renamingCampId,setRenamingCampId]=useState(null);
  const [renameVal,setRenameVal]=useState("");
  const [showVersions,setShowVersions]=useState(false);
  const [showHistory,setShowHistory]=useState(false);
  const [versions,setVersions]=useState<{id:string,name:string,ts:string}[]>([]);
  const [vName,setVName]=useState("");
  const [vLoading,setVLoading]=useState(false);
  const [vMsg,setVMsg]=useState<{type:string,text:string}|null>(null);
  const [activeVid,setActiveVid]=useState(null);
  const [confirmDel,setConfirmDel]=useState<string|null>(null);
  const [deleteConfirm,setDeleteConfirm]=useState<{message:string,onConfirm:()=>void}|null>(null);
  const [customLabels,setCustomLabels]=useState({});
  const [editingType,setEditingType]=useState(null);
  const [editVal,setEditVal]=useState("");
  const [hoveredType,setHoveredType]=useState(null);
  const [collapsedCats,setCollapsedCats]=useState({sources:true,pages:true,actions:true,text:true});
  const [showMapIt,setShowMapIt]=useState(false);
  const [isExporting,setIsExporting]=useState(false);
  const [showChangelog,setShowChangelog]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(false); // collapsed by default
  const [isMobile,setIsMobile]=useState(()=>typeof window!=='undefined'?window.innerWidth<768:false);
  useEffect(()=>{
    const mq=window.matchMedia('(max-width:767px)');
    const h=(e:MediaQueryListEvent)=>setIsMobile(e.matches);
    mq.addEventListener('change',h);
    return()=>mq.removeEventListener('change',h);
  },[]);

  const cvRef=useRef(null);
  const pan_=useRef(null);
  const drag_=useRef(null);
  const touch_=useRef<any>(null);  // touch gesture state
  const dtRef=useRef(null);
  const didDrag=useRef(false);
  const editSnap=useRef(null);
  const undoRef=useRef(null);
  const redoRef=useRef(null);
  const sidebarDrag=useRef(false);
  const tbResize=useRef<any>(null);
  // Refs that mirror state so event listeners never go stale
  const zoomR=useRef(zoom);  useEffect(()=>{zoomR.current=zoom;},[zoom]);
  const panR=useRef(pan);    useEffect(()=>{panR.current=pan;},[pan]);
  const nodesR=useRef(nodes);useEffect(()=>{nodesR.current=nodes;},[nodes]);
  const connsR=useRef(conns);useEffect(()=>{connsR.current=conns;},[conns]);
  // Sidebar touch-drag state and fresh-closure action refs
  const sideDrag_=useRef<any>(null);
  const dropOnCvRef=useRef<any>(null);  // updated each render — no stale closure
  const addCenteredRef=useRef<any>(null);
  const setShowMapItRef=useRef<any>(null);   // must be here — before early auth returns
  const setSidebarOpenRef=useRef<any>(null); // same — hooks must be unconditional

  undoRef.current=()=>{if(!past.length)return;const prev=past[past.length-1];setFuture(f=>[{nodes,conns,label:prev.label,icon:prev.icon,ts:prev.ts},...f.slice(0,HIST_MAX-1)]);setNodes(prev.nodes);setConns(prev.conns);setPast(p=>p.slice(0,-1));setSelN([]);setSelC(null);};
  redoRef.current=()=>{if(!future.length)return;const next=future[0];setPast(p=>[...p.slice(-(HIST_MAX-1)),{nodes,conns,label:next.label,icon:next.icon,ts:next.ts}]);setNodes(next.nodes);setConns(next.conns);setFuture(f=>f.slice(1));setSelN([]);setSelC(null);};
  // Jump directly to any point in the timeline (Bee-style clickable history).
  // idx is an index into the combined [past..., NOW, ...future] timeline.
  const jumpToHistory=(targetIdx)=>{
    const timeline=[...past,{nodes,conns,_now:true},...future];
    const nowIdx=past.length;
    if(targetIdx===nowIdx||targetIdx<0||targetIdx>=timeline.length)return;
    const target=timeline[targetIdx];
    if(targetIdx<nowIdx){
      // going back: entries (targetIdx+1 .. nowIdx-1) of past + current become future
      const newPast=past.slice(0,targetIdx);
      const movedForward=[...past.slice(targetIdx+1),{nodes,conns,label:past[targetIdx]?.label,icon:past[targetIdx]?.icon,ts:past[targetIdx]?.ts}];
      // Re-tag each future-bound entry with the label of the step it represents
      const tagged=[];
      for(let i=targetIdx;i<past.length;i++){
        const stateAfter=(i+1<past.length)?past[i+1]:{nodes,conns};
        tagged.push({nodes:stateAfter.nodes,conns:stateAfter.conns,label:past[i].label,icon:past[i].icon,ts:past[i].ts});
      }
      setNodes(target.nodes);setConns(target.conns);
      setPast(newPast);
      setFuture([...tagged,...future]);
    }else{
      // going forward into future
      const steps=targetIdx-nowIdx; // 1-based count into future
      const consumed=future.slice(0,steps);
      const remaining=future.slice(steps);
      const addToPast=[{nodes,conns,label:future[0].label,icon:future[0].icon,ts:future[0].ts}];
      for(let i=0;i<steps-1;i++){addToPast.push({nodes:consumed[i].nodes,conns:consumed[i].conns,label:future[i+1].label,icon:future[i+1].icon,ts:future[i+1].ts});}
      setNodes(target.nodes);setConns(target.conns);
      setPast([...past,...addToPast].slice(-HIST_MAX));
      setFuture(remaining);
    }
    setSelN([]);setSelC(null);
  };
  const jumpRef=useRef(null);jumpRef.current=jumpToHistory;
  // ── Dagre-style hierarchical layout ──────────────────────────────────────────
  const applyDagreLayout=(inputNodes,inputConns)=>{
    if(!inputNodes.length)return inputNodes;
    const NODE_SEP=40;  // vertical gap between nodes in same column
    const RANK_SEP=120; // horizontal gap between columns
    const PAGE_W=150,PAGE_H=190;
    const CIRC=70,DIAM=72,TB_W=200,TB_H=80;

    const getSize=(n)=>{
      if(n.type==="textbox")return{w:n.width||TB_W,h:n.height||TB_H};
      const d=gd(n.type);
      if(d.sh==="browser")return{w:n.nodeW||PAGE_W,h:n.nodeH||PAGE_H};
      if(d.sh==="diamond")return{w:n.nodeW||DIAM,h:n.nodeH||DIAM};
      return{w:n.nodeW||CIRC,h:n.nodeH||CIRC};
    };

    // 1. Build adjacency
    const idSet=new Set(inputNodes.map(n=>n.id));
    const adj={};    // id → [targets]
    const radj={};   // id → [sources]
    inputNodes.forEach(n=>{adj[n.id]=[];radj[n.id]=[];});
    inputConns.forEach(c=>{
      if(idSet.has(c.from)&&idSet.has(c.to)){
        adj[c.from].push(c.to);
        radj[c.to].push(c.from);
      }
    });

    // 2. Assign ranks (longest path from root)
    const rank={};
    const assignRank=(id,r)=>{
      if(rank[id]===undefined||rank[id]<r){
        rank[id]=r;
        (adj[id]||[]).forEach(t=>assignRank(t,r+1));
      }
    };
    inputNodes.forEach(n=>{if(!radj[n.id]||radj[n.id].length===0)assignRank(n.id,0);});
    inputNodes.forEach(n=>{if(rank[n.id]===undefined)assignRank(n.id,0);});

    // 3. Group by rank
    const rankGroups={};
    inputNodes.forEach(n=>{
      const r=rank[n.id]||0;
      if(!rankGroups[r])rankGroups[r]=[];
      rankGroups[r].push(n.id);
    });

    // 4. Calculate column X positions
    const ranks=Object.keys(rankGroups).map(Number).sort((a,b)=>a-b);
    const colX={};
    let curX=100;
    ranks.forEach(r=>{
      colX[r]=curX;
      const maxW=Math.max(...rankGroups[r].map(id=>{
        const n=inputNodes.find(x=>x.id===id);
        return getSize(n).w;
      }));
      curX+=maxW+RANK_SEP;
    });

    // 5. Calculate Y positions within each column
    const posMap={};
    const CANVAS_CENTER_Y=300;
    ranks.forEach(r=>{
      const ids=rankGroups[r];
      const sizes=ids.map(id=>{const n=inputNodes.find(x=>x.id===id);return getSize(n);});
      const totalH=sizes.reduce((s,sz)=>s+sz.h,0)+(ids.length-1)*NODE_SEP;
      let curY=CANVAS_CENTER_Y-totalH/2;
      ids.forEach((id,i)=>{
        posMap[id]={x:colX[r],y:Math.max(40,curY)};
        curY+=sizes[i].h+NODE_SEP;
      });
    });

    // 6. Return nodes with new positions
    return inputNodes.map(n=>({
      ...n,
      x:posMap[n.id]?.x??n.x,
      y:posMap[n.id]?.y??n.y,
    }));
  };

  // Auto-layout button handler (applies to all current nodes)
  const autoLayout=()=>{
    if(!nodes.length)return;
    saveH(nodes,conns,"histAutoLayout","⊞");
    setNodes(applyDagreLayout([...nodes],conns));
    setPan({x:80,y:50});
  };

  // ── Export to PDF ─────────────────────────────────────────────────────────
  const exportPDF=async()=>{
    if(isExporting||!cvRef.current)return;
    setIsExporting(true);
    flash("info",t.pdfExporting);

    // Save current view state
    const savedZoom=zoom, savedPan={...pan};

    try{
      // Fit all nodes to canvas so nothing gets cropped
      if(nodes.length){
        const rect=cvRef.current.getBoundingClientRect();
        const pad=56;
        let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
        nodes.forEach(n=>{const{w,h}=gs(gd(n.type),n);x0=Math.min(x0,n.x);y0=Math.min(y0,n.y);x1=Math.max(x1,n.x+w);y1=Math.max(y1,n.y+h);});
        const bw=x1-x0+pad*2, bh=y1-y0+pad*2;
        const z=Math.min(Math.max(rect.width/bw,0.15),Math.min(rect.height/bh,1.5));
        setZoom(z);
        setPan({x:rect.width/2-(x0-pad+bw/2)*z, y:rect.height/2-(y0-pad+bh/2)*z});
        // Wait for React to re-render the new zoom/pan
        await new Promise(r=>setTimeout(r,350));
      }

      // Capture the canvas element (excludes topbar, sidebar, fixed widgets)
      const html2canvas=(await import('html2canvas')).default;
      const captured=await html2canvas(cvRef.current,{
        scale:2,                  // 2× for retina quality
        useCORS:true,
        backgroundColor:'#FFFFFF',
        logging:false,
        imageTimeout:0,
      });

      // Generate PDF sized to the captured content
      const {jsPDF}=await import('jspdf');
      const imgW=captured.width/2, imgH=captured.height/2;
      const pdf=new jsPDF({
        orientation: imgW>=imgH?'landscape':'portrait',
        unit:'px',
        format:[imgW,imgH],
        compress:true,
      });
      pdf.addImage(captured.toDataURL('image/png'),'PNG',0,0,imgW,imgH);
      pdf.save(`${campName||'customer-journey'}.pdf`);
      flash("ok",t.pdfSuccess);
    }catch(err){
      console.error('PDF export error:',err);
      flash("err",t.pdfError);
    }finally{
      // Restore original view
      setZoom(savedZoom);
      setPan(savedPan);
      setIsExporting(false);
    }
  };

  const generateMapping=async()=>{
    if(!briefInitial.trim()){setGenMsg({type:"err",text:t.briefNoBriefError});setTimeout(()=>setGenMsg(null),4000);return;}
    setGenerating(true);setGenMsg({type:"info",text:t.analyzing});
    try{
      const nodeTypes=`
SOURCES PAYANTES (shape: cercle): facebook, instagram, google, twitter, youtube, linkedin, reddit, tiktok, pinterest, bing
SOURCES RECHERCHE (shape: cercle): seo, google_search, youtube_search, bing_search
SOURCES SOCIALES ORGANIQUES (shape: cercle): fb_organic, ig_organic, li_organic, x_organic, pinterest_organic, tiktok_organic, reddit_organic
SOURCES SITE WEB (shape: cercle): webpage, blog_src, popup, form
AUTRES SOURCES (shape: cercle): email, ebook, direct, sms, chatbot
PAGES (shape: page browser):
  type="page" pageStyle="abonnement" → Page d'abonnement
  type="page" pageStyle="blog" → Page de blog
  type="page" pageStyle="calendrier" → Page de calendrier/RDV
  type="page" pageStyle="commande" → Page de commande
  type="page" pageStyle="membres" → Page de membres
  type="page" pageStyle="remerciement" → Page de remerciement
  type="page" pageStyle="sondage" → Page de checklist
  type="page" pageStyle="telechargement" → Page de téléchargement
  type="page" pageStyle="vente_video" → Page de vente vidéo
  type="page" pageStyle="vente" → Page de vente
  type="page" pageStyle="webinaire" → Page de webinaire
  type="page" pageStyle="upsell" → Page d'upsell
ACTIONS DÉLAIS (shape: cercle): wait → Délai/Attente
ACTIONS CONVERSIONS (shape: losange): achat, form_complete, meeting_booked, deal
AUTRES ACTIONS (shape: losange): add_list_new, dl_pdf
`;
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:8000,
          thinking:{type:"enabled",budget_tokens:5000},
          system:`Tu es un expert en marketing digital et en customer journey mapping. 
Ton rôle est d'analyser un brief marketing et de générer un mapping complet du parcours client.
Tu dois retourner UNIQUEMENT un objet JSON valide, sans markdown, sans explication.
Format exact requis:
{
  "nodes": [
    {"id":"n1","type":"facebook","label":"Publicité Facebook","step":1},
    {"id":"n2","type":"page","pageStyle":"abonnement","label":"Page d'abonnement","step":2}
  ],
  "connections": [
    {"from":"n1","to":"n2"}
  ]
}
Règles:
- "step" représente l'étape dans le funnel (1=trafic, 2=pages, 3=actions/conversions, 4=suivi)
- Utilise UNIQUEMENT les types de nœuds disponibles dans notre système
- Crée un mapping logique et complet basé sur le brief
- Les connexions doivent refléter le vrai parcours client
- Plusieurs sources peuvent mener à la même page
- Après une conversion, ajoute les actions appropriées
Types disponibles: ${nodeTypes}`,
          messages:[{role:"user",content:`Voici le brief marketing:

${briefInitial}

Informations supplémentaires:
Objectif: ${brief.objectif||t.notSpecified}
Public cible: ${brief.publicCible||t.notSpecified}
Lead Magnet: ${brief.leadMagnet||t.notSpecified}
Sources: ${(brief.sources||[]).filter(Boolean).join(", ")||t.notSpecified}

Génère le customer journey mapping complet en JSON.`}]
        })
      });
      const data=await resp.json();
      if(!resp.ok)throw new Error(data.error?.message||"Erreur API");
      // Extract text from response (skip thinking blocks)
      const textBlock=data.content.find(b=>b.type==="text");
      if(!textBlock)throw new Error(t.briefNoResponse);
      const jsonStr=textBlock.text.replace(/```json|```/g,"").trim();
      const mapping=JSON.parse(jsonStr);
      if(!mapping.nodes||!mapping.connections)throw new Error("Format JSON invalide");
      // Build nodes with positions using step-based auto-layout
      const stepGroups={};
      mapping.nodes.forEach(n=>{const s=n.step||1;if(!stepGroups[s])stepGroups[s]=[];stepGroups[s].push(n);});
      const steps=Object.keys(stepGroups).sort((a,b)=>Number(a)-Number(b));
      const colW=220,startX=80,startY=80,rowH=160;
      const newNodes=[];const idMap={};
      steps.forEach((step,colIdx)=>{
        const group=stepGroups[step];
        group.forEach((n,rowIdx)=>{
          const id=uid();idMap[n.id]=id;
          const isPage=n.type==="page";
          const totalH=group.length*rowH;
          const offsetY=(rowIdx*rowH)-(totalH/2)+startY+(typeof window!=="undefined"?window.innerHeight/4:200);
          const nd=n.type==="page"
            ?{id,type:"page",x:startX+colIdx*colW,y:Math.max(50,offsetY),label:n.label||"Nouvelle Page",notes:"",pageStyle:n.pageStyle||"abonnement"}
            :{id,type:n.type,x:startX+colIdx*colW,y:Math.max(50,offsetY),label:n.label||n.type,notes:""};
          newNodes.push(nd);
        });
      });
      const newConns=mapping.connections.map(c=>({id:cuid(),from:idMap[c.from],to:idMap[c.to],dashed:false,color:"#6B7280",curved:true})).filter(c=>c.from&&c.to);
      // Apply dagre layout to new nodes
      const laidOut=applyDagreLayout(newNodes,newConns);
      saveH(nodes,conns,"histGenerate","✦");
      setNodes(p=>[...p,...laidOut]);
      setConns(p=>[...p,...newConns]);
      // Center view on generated content
      setPan({x:60,y:40});setZoom(0.7);
      setGenMsg({type:"ok",text:`✅ Mapping généré — ${newNodes.length} nœuds, ${newConns.length} connexions`});
      setTimeout(()=>setGenMsg(null),5000);
    }catch(e){
      console.error(e);
      setGenMsg({type:"err",text:"❌ Erreur: "+e.message});
      setTimeout(()=>setGenMsg(null),6000);
    }
    setGenerating(false);
  };

  // History cap — keep the 15 most recent snapshots (Bee-style)
  const HIST_MAX=15;
  // Each snapshot carries the state BEFORE the action, plus metadata describing
  // the action that is about to happen, so the timeline can label each step.
  const saveH=(ns:any,cs:any,label?:string,icon?:string,item?:string)=>{setPast(p=>[...p.slice(-(HIST_MAX-1)),{nodes:ns,conns:cs,label:label||"histEdit",icon:icon||"✎",item:item||null,ts:Date.now()}]);setFuture([]);};

  // Campaign helpers
  const switchCampaign=(camp)=>{
    // Save current state into campaigns array
    setCampaigns(prev=>prev.map(c=>c.id===activeCampId?{...c,nodes,conns,campName}:c));
    // Load selected campaign
    setNodes(camp.nodes||[]);
    setConns(camp.conns||[]);
    setCampName(camp.name||"Nouvelle Campagne");
    setActiveCampId(camp.id);
    setSelN([]);setSelC(null);setPast([]);setFuture([]);
    setShowCampMenu(false);
  };
  const addCampaign=()=>{
    const id="camp"+Date.now();
    const name="Nouvelle Campagne";
    // Save current first
    setCampaigns(prev=>[...prev.map(c=>c.id===activeCampId?{...c,nodes,conns,campName}:c),{id,name,nodes:[],conns:[]}]);
    setNodes([]);setConns([]);setCampName(name);
    setActiveCampId(id);
    setSelN([]);setSelC(null);setPast([]);setFuture([]);
    setShowCampMenu(false);
  };
  const deleteCampaign=(id)=>{
    if(campaigns.length<=1)return;
    const remaining=campaigns.filter(c=>c.id!==id);
    setCampaigns(remaining);
    if(id===activeCampId){
      const next=remaining[0];
      setNodes(next.nodes||[]);setConns(next.conns||[]);setCampName(next.name);
      setActiveCampId(next.id);
      setSelN([]);setSelC(null);setPast([]);setFuture([]);
    }
    setShowCampMenu(false);
  };
  const renameCampaign=(id,name)=>{
    setCampaigns(prev=>prev.map(c=>c.id===id?{...c,name}:c));
    if(id===activeCampId)setCampName(name);
    setRenamingCampId(null);
  };
  const finishEdit=()=>{if(editingType&&editVal.trim())setCustomLabels(p=>({...p,[editingType]:editVal.trim()}));setEditingType(null);};
  const askDelete=(msg,fn)=>setDeleteConfirm({message:msg,onConfirm:fn});
  const gn=id=>nodes.find(n=>n.id===id);
  const upN=(id,p)=>setNodes(ns=>ns.map(n=>n.id===id?{...n,...p}:n));
  const upC=(id,p)=>setConns(cs=>cs.map(c=>c.id===id?{...c,...p}:c));
  const toggleCat=k=>setCollapsedCats(p=>({...p,[k]:!p[k]}));

  const bringToFront=()=>{if(!selN.length)return;saveH(nodes,conns,"histLayer","⬆");setNodes(p=>[...p.filter(n=>!selN.includes(n.id)),...p.filter(n=>selN.includes(n.id))]);};
  const bringForward=()=>{if(!selN.length)return;saveH(nodes,conns,"histLayer","⬆");setNodes(p=>{const a=[...p];[...selN].reverse().forEach(id=>{const i=a.findIndex(n=>n.id===id);if(i<a.length-1&&!selN.includes(a[i+1].id)){[a[i],a[i+1]]=[a[i+1],a[i]];}});return a;});};
  const sendToBack=()=>{if(!selN.length)return;saveH(nodes,conns,"histLayer","⬇");setNodes(p=>[...p.filter(n=>selN.includes(n.id)),...p.filter(n=>!selN.includes(n.id))]);};
  const sendBackward=()=>{if(!selN.length)return;saveH(nodes,conns,"histLayer","⬇");setNodes(p=>{const a=[...p];selN.forEach(id=>{const i=a.findIndex(n=>n.id===id);if(i>0&&!selN.includes(a[i-1].id)){[a[i],a[i-1]]=[a[i-1],a[i]];}});return a;});};
  const copySelected=()=>{if(!selN.length)return;setClipboard(selN.map(id=>gn(id)).filter(Boolean));};
  const pasteClipboard=()=>{if(!clipboard.length)return;saveH(nodes,conns,"histPaste","⎘");const nn=clipboard.map(n=>({...n,id:uid(),x:n.x+30,y:n.y+30}));setNodes(p=>[...p,...nn]);setSelN(nn.map(n=>n.id));};
  const duplicateSelected=()=>{if(!selN.length)return;saveH(nodes,conns,"histDuplicate","⧉");const nn=selN.map(id=>{const n=gn(id);return n?{...n,id:uid(),x:n.x+20,y:n.y+20}:null;}).filter(Boolean);setNodes(p=>[...p,...nn]);setSelN(nn.map(n=>n.id));};
  const deleteSel=()=>{saveH(nodes,conns,"histDelete","🗑");setNodes(p=>p.filter(n=>!selN.includes(n.id)));setConns(p=>p.filter(c=>!selN.includes(c.from)&&!selN.includes(c.to)));setSelN([]);};

  const getSD=()=>selN.map(id=>{const n=gn(id);const d=gd(n?.type);const s=gs(d,n);return n?{id,n,w:s.w,h:s.h,cx:n.x+s.w/2,cy:n.y+s.h/2}:null;}).filter(Boolean);
  const alignV=()=>{const data=getSD();if(!data.length)return;const avg=data.reduce((s,d)=>s+d.cx,0)/data.length;saveH(nodes,conns,"histAlign","▤");setNodes(p=>p.map(n=>{const d=data.find(x=>x.id===n.id);return d?{...n,x:avg-d.w/2}:n;}));};
  const alignH=()=>{const data=getSD();if(!data.length)return;const avg=data.reduce((s,d)=>s+d.cy,0)/data.length;saveH(nodes,conns,"histAlign","▤");setNodes(p=>p.map(n=>{const d=data.find(x=>x.id===n.id);return d?{...n,y:avg-d.h/2}:n;}));};
  const distH=()=>{const data=getSD();if(data.length<3)return;const s=[...data].sort((a,b)=>a.cx-b.cx);const mn=s[0].cx,mx=s[s.length-1].cx,step=(mx-mn)/(s.length-1);saveH(nodes,conns,"histDistribute","▦");setNodes(p=>p.map(n=>{const i=s.findIndex(x=>x.id===n.id);if(i<0)return n;return{...n,x:mn+i*step-s[i].w/2};}));};
  const distV=()=>{const data=getSD();if(data.length<3)return;const s=[...data].sort((a,b)=>a.cy-b.cy);const mn=s[0].cy,mx=s[s.length-1].cy,step=(mx-mn)/(s.length-1);saveH(nodes,conns,"histDistribute","▦");setNodes(p=>p.map(n=>{const i=s.findIndex(x=>x.id===n.id);if(i<0)return n;return{...n,y:mn+i*step-s[i].h/2};}));};

  useEffect(()=>{(async()=>{try{const r=await storageGet("jm_versions");if(r)setVersions(JSON.parse(r.value));}catch(e){}})();},[]);
  const flash=(t,text)=>{setVMsg({type:t,text});setTimeout(()=>setVMsg(null),3000);};
  const saveVer=async()=>{setVLoading(true);try{const id=`v${Date.now()}`;const name=vName.trim()||`Version ${versions.length+1}`;const ts=new Date().toISOString();const nl=[...versions,{id,name,ts}];await storageSet(`jm_v_${id}`,JSON.stringify({nodes,conns,campName}));await storageSet("jm_versions",JSON.stringify(nl));setVersions(nl);setActiveVid(id);setVName("");flash("ok",t.flashSaved);}catch(e){flash("err",t.flashError);}setVLoading(false);};
  const restoreVer=async(v: {id:string,name:string,ts:string})=>{setVLoading(true);try{const r=await storageGet(`jm_v_${v.id}`);if(!r)throw new Error();const data=JSON.parse(r.value);saveH(nodes,conns,"histRestore","↺");setNodes(data.nodes);setConns(data.conns);if(data.campName)setCampName(data.campName);setActiveVid(v.id);setShowVersions(false);flash("ok","Restauree");}catch(e){flash("err",t.flashError);}setVLoading(false);};
  const deleteVer=async(id: string)=>{setVLoading(true);try{const nl=versions.filter(v=>v.id!==id);await storageSet("jm_versions",JSON.stringify(nl));try{await storageDelete(`jm_v_${id}`);}catch(e){}setVersions(nl);if(activeVid===id)setActiveVid(null);setConfirmDel(null);}catch(e){flash("err",t.flashError);}setVLoading(false);};

  const onCvMD=e=>{
    if(e.button!==0)return;
    const t=e.target;
    setShowCampMenu(false);
    if(t===cvRef.current||t.classList.contains("cvbg")){
      if(editingTextId)setEditingTextId(null);
      setSelN([]);setSelC(null);
      if(connMode){setConnMode(false);setConnFrom(null);return;}
      if(connectAllMode){setConnectAllMode(false);return;}
      pan_.current={sx:e.clientX-pan.x,sy:e.clientY-pan.y};
    }
  };
  const onNMD=(e,id)=>{
    e.stopPropagation();if(connMode||connectAllMode)return;if(editingTextId===id)return;
    didDrag.current=false;const n=gn(id);const inSel=selN.includes(id)&&selN.length>1;
    drag_.current={id,ox:n.x,oy:n.y,mx:e.clientX,my:e.clientY,pNodes:nodes,pConns:conns,
      multiDrag:inSel?selN.map(sid=>{const sn=nodes.find(x=>x.id===sid);return sn?{id:sid,ox:sn.x,oy:sn.y}:null;}).filter(Boolean):null};
  };
  const onNClick=(e,id)=>{
    e.stopPropagation();if(didDrag.current){didDrag.current=false;return;}setSelC(null);
    if(connectAllMode){
      if(!selN.includes(id)){
        saveH(nodes,conns,"histConnectMulti","↬");
        const nc=selN.filter(sid=>!conns.some(c=>c.from===sid&&c.to===id)).map(sid=>({id:cuid(),from:sid,to:id,dashed:connDash,color:newConnColor,curved:connCurved}));
        setConns(p=>[...p,...nc]);setConnectAllMode(false);flash("ok",`${nc.length} connexion${nc.length>1?"s":""} creee${nc.length>1?"s":""}`);
      }
      return;
    }
    if(connMode){if(!connFrom){setConnFrom(id);return;}if(connFrom!==id&&!conns.some(c=>c.from===connFrom&&c.to===id)){saveH(nodes,conns,"histConnect","↬");setConns(p=>[...p,{id:cuid(),from:connFrom,to:id,dashed:connDash,color:newConnColor,curved:connCurved}]);}setConnFrom(null);return;}
    if(e.ctrlKey||e.metaKey){setSelN(prev=>prev.includes(id)?prev.filter(s=>s!==id):[...prev,id]);}
    else{if(editingTextId&&editingTextId!==id)setEditingTextId(null);setSelN([id]);}
  };
  const onNDbl=(e,id)=>{e.stopPropagation();if(gn(id)?.type==="textbox"){setEditingTextId(id);setSelN([id]);}};
  const onConnClick=(e,cid)=>{e.stopPropagation();setSelN([]);setSelC(p=>p===cid?null:cid);};

  useEffect(()=>{
    const mm=e=>{
      if(sidebarDrag.current){setSidebarW(Math.max(160,Math.min(340,e.clientX)));return;}
      if(dragMidConn){
        const dx=(e.clientX-dragMidConn.mx)/zoom,dy=(e.clientY-dragMidConn.my)/zoom;
        setConns(cs=>cs.map(c=>c.id===dragMidConn.id?{...c,midX:dragMidConn.ox+dx,midY:dragMidConn.oy+dy}:c));
        return;
      }
      if(tbResize.current){
        const{id,ow,oh,ox,oy,mx,my,mode}=tbResize.current;
        const dx=(e.clientX-mx)/zoom,dy=(e.clientY-my)/zoom;
        const minS=40;
        const ratio=ow/oh; // preserve aspect ratio
        const node=nodes.find(n=>n.id===id);
        const isTB=node?.type==="textbox";
        let u: Record<string,any> = {};
        if(isTB){
          // Textbox: free resize, no ratio constraint
          if(mode==="se"){u.width=Math.max(minS,ow+dx);u.height=Math.max(minS,oh+dy);}
          else if(mode==="nw"){const nw=Math.max(minS,ow-dx);const nh=Math.max(minS,oh-dy);u.width=nw;u.height=nh;u.x=ox+(ow-nw);u.y=oy+(oh-nh);}
          else if(mode==="ne"){const nw=Math.max(minS,ow+dx);const nh=Math.max(minS,oh-dy);u.width=nw;u.height=nh;u.y=oy+(oh-nh);}
          else if(mode==="sw"){const nw=Math.max(minS,ow-dx);const nh=Math.max(minS,oh+dy);u.width=nw;u.height=nh;u.x=ox+(ow-nw);}
        } else {
          // Proportional resize: pick dominant axis with correct sign per corner
          let delta;
          if(mode==="se"){delta=Math.abs(dx)>Math.abs(dy)?dx:dy;}           // right/down = grow
          else if(mode==="nw"){delta=Math.abs(dx)>Math.abs(dy)?-dx:-dy;}    // left/up = grow
          else if(mode==="ne"){delta=Math.abs(dx)>Math.abs(dy)?dx:-dy;}     // right/up = grow
          else if(mode==="sw"){delta=Math.abs(dx)>Math.abs(dy)?-dx:dy;}     // left/down = grow
          else{delta=Math.max(dx,dy);}
          const newS=Math.max(minS,ow+delta);
          const newH=Math.round(newS/ratio);
          u.nodeW=Math.round(newS);u.nodeH=newH;
          // Anchor opposite corner: reposition x for left handles, y for top handles
          if(mode==="nw"||mode==="sw"){u.x=ox+(ow-Math.round(newS));}
          if(mode==="nw"||mode==="ne"){u.y=oy+(oh-newH);}
        }
        setNodes(p=>p.map(n=>n.id===id?{...n,...u}:n));return;
      }
      if(pan_.current&&!drag_.current)setPan({x:e.clientX-pan_.current.sx,y:e.clientY-pan_.current.sy});
      if(drag_.current){
        const{id,ox,oy,mx,my,multiDrag}=drag_.current;const dx=(e.clientX-mx)/zoom,dy=(e.clientY-my)/zoom;
        if(Math.abs(e.clientX-mx)>3||Math.abs(e.clientY-my)>3)didDrag.current=true;
        if(multiDrag&&multiDrag.length>1){setNodes(p=>p.map(n=>{const md=multiDrag.find(m=>m.id===n.id);return md?{...n,x:md.ox+dx,y:md.oy+dy}:n;}));}
        else{setNodes(p=>p.map(n=>n.id===id?{...n,x:ox+dx,y:oy+dy}:n));}
      }
    };
    const mu=()=>{
      if(dragMidConn){setDragMidConn(null);return;}
      if(sidebarDrag.current){sidebarDrag.current=false;document.body.style.cursor="";document.body.style.userSelect="";}
      if(tbResize.current){const{pNodes,pConns}=tbResize.current;setPast(p=>[...p.slice(-(HIST_MAX-1)),{nodes:pNodes,conns:pConns,label:"histResize",icon:"⤡",ts:Date.now()}]);setFuture([]);tbResize.current=null;}
      if(drag_.current&&didDrag.current){const{pNodes,pConns}=drag_.current;setPast(p=>[...p.slice(-(HIST_MAX-1)),{nodes:pNodes,conns:pConns,label:"histMove",icon:"✥",ts:Date.now()}]);setFuture([]);}
      pan_.current=null;drag_.current=null;
    };
    window.addEventListener("mousemove",mm);window.addEventListener("mouseup",mu);
    return()=>{window.removeEventListener("mousemove",mm);window.removeEventListener("mouseup",mu);};
  },[zoom,dragMidConn]);

  // ── Touch + Wheel handlers (need passive:false so we can preventDefault) ──
  useEffect(()=>{
    const el=cvRef.current;if(!el)return;

    // ── Wheel: zoom toward cursor ─────────────────────────────────────────
    const wh=(e:WheelEvent)=>{
      e.preventDefault();
      const rect=el.getBoundingClientRect();
      const mx=e.clientX-rect.left,my=e.clientY-rect.top;
      const factor=e.deltaY>0?0.92:1.08;
      setZoom(z=>{
        const nz=Math.max(0.15,Math.min(4,z*factor));
        setPan(p=>({x:mx-(mx-p.x)*(nz/z),y:my-(my-p.y)*(nz/z)}));
        return nz;
      });
    };

    // ── Touch: pan (1 finger) + pinch-zoom (2 fingers) + tap ─────────────
    const ts=(e:TouchEvent)=>{
      e.preventDefault();
      const t0=e.touches[0];

      if(e.touches.length===1){
        // Find if touch is on a node
        const hit=document.elementFromPoint(t0.clientX,t0.clientY);
        const nodeEl=(hit as Element)?.closest('[data-nodeid]') as HTMLElement|null;
        const nodeId=nodeEl?.dataset?.nodeid;
        const n=nodeId?nodesR.current.find((x:any)=>x.id===nodeId):null;

        if(n){
          // Touch on a node — potential drag
          touch_.current={
            type:'node',id:nodeId,
            ox:n.x,oy:n.y,
            mx:t0.clientX,my:t0.clientY,
            startX:t0.clientX,startY:t0.clientY,
            startTime:Date.now(),moved:false,
            pNodes:[...nodesR.current],pConns:[...connsR.current]
          };
        } else {
          // Touch on canvas background — pan
          touch_.current={
            type:'pan',
            sx:t0.clientX-panR.current.x,
            sy:t0.clientY-panR.current.y,
            startX:t0.clientX,startY:t0.clientY,
            startTime:Date.now()
          };
          setSelN([]);setSelC(null);
        }
      } else if(e.touches.length===2){
        const t1=e.touches[1];
        const dist=Math.hypot(t1.clientX-t0.clientX,t1.clientY-t0.clientY);
        touch_.current={
          type:'pinch',
          startDist:dist,startZoom:zoomR.current,
          startPx:panR.current.x,startPy:panR.current.y,
          cx:(t0.clientX+t1.clientX)/2,
          cy:(t0.clientY+t1.clientY)/2,
        };
      }
    };

    const tm=(e:TouchEvent)=>{
      e.preventDefault();
      const tc=touch_.current;if(!tc)return;
      const t0=e.touches[0];

      if(tc.type==='pan'&&e.touches.length===1){
        setPan({x:t0.clientX-tc.sx,y:t0.clientY-tc.sy});

      } else if(tc.type==='pinch'&&e.touches.length===2){
        const t1=e.touches[1];
        const dist=Math.hypot(t1.clientX-t0.clientX,t1.clientY-t0.clientY);
        const scale=dist/tc.startDist;
        const nz=Math.max(0.15,Math.min(4,tc.startZoom*scale));
        const ratio=nz/tc.startZoom;
        setZoom(nz);
        setPan({x:tc.cx-(tc.cx-tc.startPx)*ratio,y:tc.cy-(tc.cy-tc.startPy)*ratio});

      } else if(tc.type==='node'&&e.touches.length===1){
        const dx=(t0.clientX-tc.mx)/zoomR.current;
        const dy=(t0.clientY-tc.my)/zoomR.current;
        if(Math.abs(t0.clientX-tc.startX)>6||Math.abs(t0.clientY-tc.startY)>6){
          tc.moved=true;
          setNodes((p:any[])=>p.map(n=>n.id===tc.id?{...n,x:tc.ox+dx,y:tc.oy+dy}:n));
        }
      }
    };

    const te=(e:TouchEvent)=>{
      const tc=touch_.current;if(!tc)return;

      if(tc.type==='pan'&&e.changedTouches.length){
        // Tap on background — already deselected on touchstart
      } else if(tc.type==='node'){
        if(!tc.moved){
          // Tap on node → select it
          setSelN([tc.id]);setSelC(null);
        } else {
          // Drag finished → save to undo history
          setPast((p:any[])=>[...p.slice(-(HIST_MAX-1)),{nodes:tc.pNodes,conns:tc.pConns,label:"histMove",icon:"✥",ts:Date.now()}]);
          setFuture([]);
        }
      } else if(tc.type==='pinch'&&e.touches.length===1){
        // One finger lifted → switch back to pan
        const t0=e.touches[0];
        touch_.current={
          type:'pan',
          sx:t0.clientX-panR.current.x,
          sy:t0.clientY-panR.current.y,
          startX:t0.clientX,startY:t0.clientY,
          startTime:Date.now()
        };
        return;
      }

      if(e.touches.length===0)touch_.current=null;
    };

    el.addEventListener('wheel',wh,{passive:false});
    el.addEventListener('touchstart',ts,{passive:false});
    el.addEventListener('touchmove',tm,{passive:false});
    el.addEventListener('touchend',te,{passive:false});
    el.addEventListener('touchcancel',te,{passive:false});
    return()=>{
      el.removeEventListener('wheel',wh);
      el.removeEventListener('touchstart',ts);
      el.removeEventListener('touchmove',tm);
      el.removeEventListener('touchend',te);
      el.removeEventListener('touchcancel',te);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    const kd=e=>{
      const inTxt=document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA";
      if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key==="z"){e.preventDefault();undoRef.current?.();return;}
      if((e.ctrlKey||e.metaKey)&&(e.key==="y"||(e.shiftKey&&e.key==="z"))){e.preventDefault();redoRef.current?.();return;}
      if((e.ctrlKey||e.metaKey)&&e.key==="d"){e.preventDefault();duplicateSelected();return;}
      if((e.ctrlKey||e.metaKey)&&e.key==="0"){e.preventDefault();setZoom(1);setPan({x:80,y:50});return;}
      if((e.ctrlKey||e.metaKey)&&e.key==="c"&&!inTxt){e.preventDefault();copySelected();return;}
      if((e.ctrlKey||e.metaKey)&&e.key==="v"&&!inTxt){e.preventDefault();pasteClipboard();return;}
      if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key==="]"){e.preventDefault();bringForward();return;}
      if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key==="]"){e.preventDefault();bringToFront();return;}
      if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key==="["){e.preventDefault();sendBackward();return;}
      if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key==="["){e.preventDefault();sendToBack();return;}
      if(inTxt)return;
      if(e.key==="Delete"||e.key==="Backspace"){
        if(selN.length>0){saveH(nodes,conns,"histDelete","🗑");setNodes(p=>p.filter(n=>!selN.includes(n.id)));setConns(p=>p.filter(c=>!selN.includes(c.from)&&!selN.includes(c.to)));setSelN([]);}
        else if(selC){saveH(nodes,conns,"histDisconnect","✂");setConns(p=>p.filter(c=>c.id!==selC));setSelC(null);}
      }
      if(e.key==="Escape"){setConnMode(false);setConnFrom(null);setConnectAllMode(false);setSelN([]);setSelC(null);setShowVersions(false);setEditingType(null);setDeleteConfirm(null);setEditingTextId(null);}
    };
    window.addEventListener("keydown",kd);return()=>window.removeEventListener("keydown",kd);
  },[selN,selC,nodes,conns,clipboard]);

  const onSBDS=(e,type)=>{dtRef.current=type;};
  const onCvDrop=e=>{
    e.preventDefault();const type=dtRef.current;if(!type)return;
    const rect=cvRef.current.getBoundingClientRect();const d=gd(type);const{w,h}=gs(d,null);
    const x=(e.clientX-rect.left-pan.x)/zoom-w/2,y=(e.clientY-rect.top-pan.y)/zoom-h/2;
    saveH(nodes,conns,"histAdd","✚",type);
    const isPageStyle=type.startsWith("page_");
    const pageStyleId=isPageStyle?type.replace("page_",""):"abonnement";
    const pageStyleDef=PAGE_STYLES.find(s=>s.id===pageStyleId)||PAGE_STYLES[0];
    const nn=type==="textbox"
      ?{id:uid(),type:"textbox",x,y,width:200,height:80,text:"",font:"'Inter',system-ui,sans-serif",size:14,color:"#1E293B",bold:false,italic:false,underline:false,align:"left",link:"",bgColor:""}
      :(type==="page"||isPageStyle)
      ?{id:uid(),type:"page",x,y,label:isPageStyle?t[pageStyleDef.labelKey]:t.nodeAddPage,notes:"",pageStyle:pageStyleId}
      :{id:uid(),type,x,y,label:getDL(type,customLabels),notes:""};
    setNodes(p=>[...p,nn]);dtRef.current=null;
  };

  const rConn=conn=>{
    const fn=gn(conn.from),tn=gn(conn.to);if(!fn||!tn)return null;
    const{w:fw,h:fh}=gs(gd(fn.type),fn),{w:tw,h:th}=gs(gd(tn.type),tn);
    const fcx=fn.x+fw/2,fcy=fn.y+fh/2,tcx=tn.x+tw/2,tcy=tn.y+th/2;
    const ang=Math.atan2(tcy-fcy,tcx-fcx);
    const src=edgePt(fn,ang),tgt=edgePt(tn,ang+Math.PI);
    const isCurved=conn.curved!==false;
    // mid offset for bending
    const mx=conn.midX!=null?conn.midX:(src.x+tgt.x)/2;
    const my=conn.midY!=null?conn.midY:(src.y+tgt.y)/2;
    const dist=Math.hypot(tgt.x-src.x,tgt.y-src.y);
    const showMid=dist>80;
    let dp;
    if(isCurved){
      if(conn.midX!=null){
        dp=`M${src.x} ${src.y} Q${conn.midX} ${conn.midY} ${tgt.x} ${tgt.y}`;
      } else {
        const dx=tgt.x-src.x;
        dp=`M${src.x} ${src.y} C${src.x+dx*.5} ${src.y} ${tgt.x-dx*.5} ${tgt.y} ${tgt.x} ${tgt.y}`;
      }
    } else {
      dp=`M${src.x} ${src.y} L${tgt.x} ${tgt.y}`;
    }
    const ah=Math.atan2(tgt.y-src.y,tgt.x-src.x);const al=12,aw=.38;
    const isSel=selC===conn.id,isRel=selN.includes(conn.from)||selN.includes(conn.to);
    const col=isSel?"#2563EB":isRel?"#93C5FD":(conn.color||"#CBD5E1");
    const midDisplayX=conn.midX!=null?conn.midX:(src.x+tgt.x)/2;
    const midDisplayY=conn.midY!=null?conn.midY:(src.y+tgt.y)/2;
    return(<g key={conn.id}>
      <path d={dp} fill="none" stroke="transparent" strokeWidth={14} style={{cursor:"pointer",pointerEvents:"stroke"}} onClick={e=>onConnClick(e,conn.id)}/>
      <path d={dp} fill="none" stroke={col} strokeWidth={isSel?2.5:1.8} strokeDasharray={conn.dashed?"7,4":"none"} style={{pointerEvents:"none"}}/>
      <polygon points={`${tgt.x},${tgt.y} ${tgt.x-al*Math.cos(ah-aw)},${tgt.y-al*Math.sin(ah-aw)} ${tgt.x-al*Math.cos(ah+aw)},${tgt.y-al*Math.sin(ah+aw)}`} fill={col} style={{pointerEvents:"none"}}/>
      {showMid&&isSel&&<circle cx={midDisplayX} cy={midDisplayY} r={7} fill="#fff" stroke={col} strokeWidth={2} style={{cursor:"grab"}}
        onMouseDown={e=>{e.stopPropagation();setDragMidConn({id:conn.id,mx:e.clientX,my:e.clientY,ox:midDisplayX,oy:midDisplayY});}}/>}
    </g>);
  };

  const sn=selN.length===1?gn(selN[0]):null;
  const snD=sn?gd(sn.type):null;
  const isTB=sn?.type==="textbox";
  const isPage=sn?.type==="page";
  const selConn=selC?conns.find(c=>c.id===selC):null;
  const canUndo=past.length>0,canRedo=future.length>0;
  const showRP=selN.length>0||!!selConn;
  const can3=selN.length>=3;
  const hasNodes=nodes.length>0;

  const btnS:React.CSSProperties={background:"transparent",border:"none",color:"#374151",padding:"0 10px",height:30,borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"};
  const lbS:React.CSSProperties={display:"block",color:"#6B7280",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:4};
  const inS:React.CSSProperties={width:"100%",background:"#F9FAFB",border:"1px solid #E5E7EB",color:"#111827",padding:"6px 8px",borderRadius:6,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  const togBtnS=(act:boolean):React.CSSProperties=>({background:act?"#2563EB":"#0F172A",border:`1px solid ${act?"#2563EB":"#E5E7EB"}`,color:"#fff",borderRadius:5,width:30,height:28,cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"});
  const onEF=()=>{editSnap.current={nodes:[...nodes],conns:[...conns]};};
  const onEB=()=>{if(editSnap.current){saveH(editSnap.current.nodes,editSnap.current.conns,"histEditText","T");editSnap.current=null;}};
  const cursorMap={n:"ns-resize",s:"ns-resize",e:"ew-resize",w:"ew-resize",ne:"nesw-resize",sw:"nesw-resize",nw:"nwse-resize",se:"nwse-resize",both:"nwse-resize",h:"ew-resize"};
  const mkH=(id,mode,w,h,ox,oy)=>({onMouseDown:e=>{e.stopPropagation();document.body.style.cursor=cursorMap[mode]||"nwse-resize";document.body.style.userSelect="none";tbResize.current={id,ow:w,oh:h,ox:ox||0,oy:oy||0,mx:e.clientX,my:e.clientY,pNodes:nodes,pConns:conns,mode};}});
  const btnDup={background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#fff",padding:"7px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4,flex:1};
  const btnDel={background:"#fff",border:"1.5px solid #EF4444",color:"#EF4444",padding:"7px",borderRadius:6,cursor:"pointer",fontSize:15,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:4,width:38,flexShrink:0};
  const btnCopy={background:"#F9FAFB",border:"1px solid #E5E7EB",color:"#374151",padding:"6px 8px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4,flex:1};

  const LayerSection=()=>(
    <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
      <SH>Calque</SH>
      <div style={{display:"flex",gap:4}}>
        <LayerBtn onClick={bringToFront} icon="⬆" label={t.bringToFront} kbd="⌘⇧]"/>
        <LayerBtn onClick={bringForward} icon="↑" label={t.bringForward} kbd="⌘]"/>
        <LayerBtn onClick={sendBackward} icon="↓" label={t.sendBackward} kbd="⌘["/>
        <LayerBtn onClick={sendToBack} icon="⬇" label={t.sendToBack} kbd="⌘⇧["/>
      </div>
    </div>
  );

  // ─── Connections panel (in/out) ────────────────────────────────────────────
  const ConnPanel=({nodeId})=>{
    const outConns=conns.filter(c=>c.from===nodeId);
    const inConns=conns.filter(c=>c.to===nodeId);
    return(
      <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
        <SH>Connexions entrantes</SH>
        {inConns.length===0
          ?<div style={{color:"#9CA3AF",fontSize:11,fontStyle:"italic",marginBottom:8}}>{t.noConnections}</div>
          :inConns.map(c=>{const fn=gn(c.from);return fn?(<div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",fontSize:11,color:"#374151",borderBottom:"1px solid #1E2D40"}}>
            <span style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:c.color||"#94A3B8",flexShrink:0,display:"inline-block"}}/>
              {fn.label}  →
            </span>
            <button onClick={()=>{saveH(nodes,conns,"histDisconnect","✂");setConns(p=>p.filter(x=>x.id!==c.id));}} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:11,flexShrink:0}}>✕</button>
          </div>):null;})}
        <SH>Connexions sortantes</SH>
        {outConns.length===0
          ?<div style={{color:"#9CA3AF",fontSize:11,fontStyle:"italic"}}>{t.noConnections}</div>
          :outConns.map(c=>{const tn=gn(c.to);return tn?(<div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",fontSize:11,color:"#374151",borderBottom:"1px solid #1E2D40"}}>
            <span style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:c.color||"#94A3B8",flexShrink:0,display:"inline-block"}}/>
              → {tn.label}
            </span>
            <button onClick={()=>{saveH(nodes,conns,"histDisconnect","✂");setConns(p=>p.filter(x=>x.id!==c.id));}} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:11,flexShrink:0}}>✕</button>
          </div>):null;})}
      </div>
    );
  };

  // ─── Page Style Picker ─────────────────────────────────────────────────────
  const PageStyleSection=({node})=>{
    const currentStyle=node?.pageStyle||"abonnement";
    return(
      <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
        <SH>Style de page</SH>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {PAGE_STYLES.map(ps=>{
            const isSel=currentStyle===ps.id;
            return(
              <div key={ps.id}
                onClick={()=>{saveH(nodes,conns,"histPageStyle","▢");upN(node.id,{pageStyle:ps.id,label:t[ps.labelKey]});}}
                style={{cursor:"pointer",borderRadius:6,border:`2px solid ${isSel?"#2563EB":"#E5E7EB"}`,background:isSel?"rgba(59,130,246,.08)":"#0F172A",padding:"5px 4px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"border-color .15s",boxShadow:isSel?"0 0 0 1px #1D4ED8":""}}
                onMouseEnter={e=>{if(!isSel)e.currentTarget.style.borderColor="#475569";}}
                onMouseLeave={e=>{if(!isSel)e.currentTarget.style.borderColor="#E5E7EB";}}>
                <div style={{width:86,height:108,borderRadius:3,overflow:"hidden",flexShrink:0}}>{ps.thumb(t)}</div>
                <span style={{fontSize:8.5,color:isSel?"#93C5FD":"#94A3B8",textAlign:"center",lineHeight:1.3,fontWeight:isSel?700:400}}>{t[ps.labelKey]}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Arrow tool bottom bar ─────────────────────────────────────────────────
  // Add node centered on visible canvas
  const addNodeCentered=(type)=>{
    const cvEl=cvRef.current;
    if(!cvEl)return;
    const rect=cvEl.getBoundingClientRect();
    const d=gd(type);
    const{w,h}=gs(d,null);
    const cx=(rect.width/2-pan.x)/zoom;
    const cy=(rect.height/2-pan.y)/zoom;
    const x=cx-w/2, y=cy-h/2;
    saveH(nodes,conns,"histAdd","✚",type);
    const isPageStyle=type.startsWith("page_");
    const pageStyleId=isPageStyle?type.replace("page_",""):"abonnement";
    const pageStyleDef=PAGE_STYLES.find(s=>s.id===pageStyleId)||PAGE_STYLES[0];
    const nd=type==="textbox"
      ?{id:uid(),type:"textbox",x,y,width:200,height:80,text:"",font:"'Inter',system-ui,sans-serif",size:14,color:"#1E293B",bold:false,italic:false,underline:false,align:"left",link:"",bgColor:""}
      :(type==="page"||isPageStyle)
      ?{id:uid(),type:"page",x,y,label:isPageStyle?t[pageStyleDef.labelKey]:t.nodeAddPage,notes:"",pageStyle:pageStyleId}
      :{id:uid(),type,x,y,label:getDL(type,customLabels),notes:""};
    setNodes(p=>[...p,nd]);
    setSelN([nd.id]);
    setShowMapIt(false);
  };

  // Keep fresh-closure refs current so touch listeners always call latest logic
  addCenteredRef.current=addNodeCentered;
  setShowMapItRef.current=setShowMapIt;
  setSidebarOpenRef.current=setSidebarOpen;
  dropOnCvRef.current=(type:string,clientX:number,clientY:number)=>{
    const cvEl=cvRef.current;if(!cvEl)return;
    const rect=cvEl.getBoundingClientRect();
    const d=gd(type);const{w,h}=gs(d,null);
    const x=(clientX-rect.left-panR.current.x)/zoomR.current-w/2;
    const y=(clientY-rect.top-panR.current.y)/zoomR.current-h/2;
    saveH(nodesR.current,connsR.current,"histAdd","✚",type);
    const isPageStyle=type.startsWith("page_");
    const pageStyleId=isPageStyle?type.replace("page_",""):"abonnement";
    const pageStyleDef=PAGE_STYLES.find(s=>s.id===pageStyleId)||PAGE_STYLES[0];
    const nn=type==="textbox"
      ?{id:uid(),type:"textbox",x,y,width:200,height:80,text:"",font:"'Inter',system-ui,sans-serif",size:14,color:"#1E293B",bold:false,italic:false,underline:false,align:"left",link:"",bgColor:""}
      :(type==="page"||isPageStyle)
      ?{id:uid(),type:"page",x,y,label:isPageStyle?(t as any)[pageStyleDef.labelKey]:t.nodeAddPage,notes:"",pageStyle:pageStyleId}
      :{id:uid(),type,x,y,label:(customLabels as any)[type]||(t as any)[gd(type)?.labelKey]||gd(type)?.label||type,notes:""};
    setNodes((p:any[])=>[...p,nn]);
  };

  // ── Sidebar touch drag ── document-level listeners (set up once) ──────────
  useEffect(()=>{
    const mkGhost=(label:string,cx:number,cy:number)=>{
      const el=document.createElement('div');
      el.textContent='+ '+label;
      el.style.cssText='position:fixed;pointer-events:none;z-index:99999;background:#FFFFFF;border:2px solid #2563EB;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:700;color:#111827;font-family:Inter,system-ui,sans-serif;opacity:.96;white-space:nowrap;transform:translate(-50%,-140%);box-shadow:0 4px 20px rgba(37,99,235,.25);transition:border-color .1s';
      el.style.left=cx+'px';el.style.top=cy+'px';
      document.body.appendChild(el);return el;
    };

    const tm=(e:TouchEvent)=>{
      const sd=sideDrag_.current;if(!sd)return;
      const t0=e.touches[0];
      const dx=t0.clientX-sd.startX,dy=t0.clientY-sd.startY;

      if(!sd.started){
        // Cancel if predominantly vertical scroll intent
        if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){sideDrag_.current=null;return;}
        if(Math.hypot(dx,dy)>8){
          sd.started=true;
          sd.ghost=mkGhost(sd.label,t0.clientX,t0.clientY);
          touch_.current=null; // cancel any canvas pan/pinch
          // If dragging from MapIt modal, close it so canvas is visible
          if(sd.fromMapIt)setShowMapItRef.current?.(false);
        }
        return;
      }
      e.preventDefault();
      sd.clientX=t0.clientX;sd.clientY=t0.clientY;
      sd.ghost.style.left=t0.clientX+'px';
      sd.ghost.style.top=t0.clientY+'px';
      // Green border when over canvas
      const cvEl=cvRef.current;
      if(cvEl){
        const r=cvEl.getBoundingClientRect();
        const over=t0.clientX>=r.left&&t0.clientX<=r.right&&t0.clientY>=r.top&&t0.clientY<=r.bottom;
        sd.ghost.style.borderColor=over?'#16A34A':'#2563EB';
        if(over)sd.ghost.style.color='#15803D'; else sd.ghost.style.color='#111827';
      }
    };

    const te=()=>{
      const sd=sideDrag_.current;if(!sd)return;
      if(sd.started){
        sd.ghost?.remove();
        const cvEl=cvRef.current;
        if(cvEl){
          const r=cvEl.getBoundingClientRect();
          const{clientX=sd.startX,clientY=sd.startY}=sd;
          if(clientX>=r.left&&clientX<=r.right&&clientY>=r.top&&clientY<=r.bottom){
            dropOnCvRef.current?.(sd.type,clientX,clientY);
          }
        }
      } else {
        // Tap (no drag) — add to canvas center
        // MapIt items already have onClick → don't double-add
        if(!sd.fromMapIt){
          addCenteredRef.current?.(sd.type);
          // Close sidebar overlay on mobile after adding
          setSidebarOpenRef.current?.(false);
        }
      }
      sideDrag_.current=null;
    };

    document.addEventListener('touchmove',tm,{passive:false});
    document.addEventListener('touchend',te);
    document.addEventListener('touchcancel',te);
    return()=>{
      document.removeEventListener('touchmove',tm);
      document.removeEventListener('touchend',te);
      document.removeEventListener('touchcancel',te);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const MapItTabs=({addNodeCentered,customLabels})=>{
    const [activeTab,setActiveTab]=useState("sources");
    const tabs=[{k:"sources",l:t.secSources},{k:"pages",l:t.secPages},{k:"actions",l:t.secActions}];
    const sectionMap={
      sources:[
        {title:"Payantes",            items:ND.filter(d=>d.cat==="src_payant")},
        {title:"Moteur de recherche", items:ND.filter(d=>d.cat==="src_search")},
        {title:"Média sociaux",       items:ND.filter(d=>d.cat==="src_social")},
        {title:"Site Web",            items:ND.filter(d=>d.cat==="src_web")},
        {title:"Autres",              items:ND.filter(d=>d.cat==="src_autres")},
        {title:"Messages",            items:ND.filter(d=>d.cat==="src_msg")},
      ],
      pages:[{title:"Styles de pages", items:PAGE_STYLES.map(ps=>({type:"page_"+ps.id,label:t[ps.labelKey],sh:"browser",_pageStyle:ps.id,_thumb:ps.thumb(t)}))}],
      actions:[
        {title:"Délais",      items:ND.filter(d=>d.cat==="act_delai")},
        {title:"Conversions", items:ND.filter(d=>d.cat==="act_conv")},
        {title:"Autres",      items:ND.filter(d=>d.cat==="act_autres")},
        {title:"Texte",       items:ND.filter(d=>d.cat==="text")},
      ],
    };
    return(
      <>
        <div style={{display:"flex",background:"#F1F5F9",borderBottom:"1px solid #E2E8F0"}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>setActiveTab(t.k)} style={{flex:1,padding:"12px 0",border:"none",borderBottom:activeTab===t.k?"3px solid #2563EB":"3px solid transparent",background:"transparent",color:activeTab===t.k?"#1E40AF":"#64748B",fontWeight:activeTab===t.k?700:500,fontSize:13,cursor:"pointer",transition:"all .15s"}}>
              {t.l}
            </button>
          ))}
        </div>
        <div style={{overflowY:"auto",padding:"20px 24px",flex:1}}>
          {(sectionMap[activeTab]||[]).map(section=>(
            section.items.length===0?null:
            <div key={section.title} style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:.8,marginBottom:12,paddingBottom:6,borderBottom:"1px solid #E2E8F0"}}>{section.title}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
                {section.items.map(d=>{
                  const dl=getDL(d.type,customLabels);
                  const isPage=d.sh==="browser";
                  const isDiamond=d.sh==="diamond";
                  const hasBadge=d.cat==="src_payant";
                  const thumbStyle=d._thumb||(PAGE_STYLES.find(s=>s.id==="abonnement")||PAGE_STYLES[0]).thumb;
                  const itemW=isPage?110:72;
                  return(
                    <div key={d.type} onClick={()=>addNodeCentered(d.type)}
                      onTouchStart={e=>{
                        const t0=e.touches[0];
                        sideDrag_.current={type:d.type,label:dl,startX:t0.clientX,startY:t0.clientY,clientX:t0.clientX,clientY:t0.clientY,started:false,ghost:null,fromMapIt:true};
                      }}
                      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",padding:"10px 8px",borderRadius:10,border:"2px solid transparent",transition:"all .15s",width:itemW,textAlign:"center",boxSizing:"border-box"}}
                      onPointerEnter={e=>{(e.currentTarget as HTMLElement).style.background="#EFF6FF";(e.currentTarget as HTMLElement).style.borderColor="#BFDBFE";(e.currentTarget as HTMLElement).style.boxShadow="0 2px 8px rgba(59,130,246,.12)";}}
                      onPointerLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.borderColor="transparent";(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                      <div style={{position:"relative",width:isPage?94:56,height:isPage?118:56,flexShrink:0}}>
                        {isPage?(
                          <div style={{width:94,height:118,borderRadius:6,overflow:"hidden",border:"1.5px solid #CBD5E1",background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>
                            <div style={{width:86,height:108,transform:"scale(1.093,1.093)",transformOrigin:"top left"}}>
                              {thumbStyle}
                            </div>
                          </div>
                        ):isDiamond?(
                          <div style={{width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                            <div style={{width:38,height:38,background:d.bg||"#1E293B",transform:"rotate(45deg)",borderRadius:4,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}/>
                            <div style={{position:"absolute",color:d.fg||"#fff",fontSize:15,fontWeight:800}}>
                              {LOGOS[d.type]?React.cloneElement(LOGOS[d.type],{width:22,height:22}):d.icon}
                            </div>
                          </div>
                        ):(
                          <div style={{width:56,height:56,position:"relative"}}>
                            <div style={{width:56,height:56,borderRadius:"50%",overflow:"hidden",background:d.bg||"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>
                              {LOGOS[d.type]?React.cloneElement(LOGOS[d.type],{width:56,height:56,style:{display:"block"}}):<span style={{fontSize:20,color:d.fg||"#fff"}}>{d.icon}</span>}
                            </div>
                            {hasBadge&&<div style={{position:"absolute",bottom:0,right:0,width:18,height:18,borderRadius:"50%",background:d.bg||"#2563EB",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#fff"}}>$</div>}
                          </div>
                        )}
                      </div>
                      <span style={{fontSize:10,color:"#374151",fontWeight:600,lineHeight:1.3,wordBreak:"break-word"}}>{dl}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const ArrowToolBar=()=>(    <div style={{borderTop:"1px solid #2D3F55",background:"#FFFFFF",padding:"8px 8px 10px",flexShrink:0}}>
      <div style={{fontSize:9.5,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>🔗 Outil Connexion</div>
      <div
        onClick={()=>{if(hasNodes){setConnMode(m=>!m);setConnFrom(null);setConnectAllMode(false);}}}
        style={{display:"flex",alignItems:"center",gap:7,padding:"6px 8px",cursor:hasNodes?"pointer":"not-allowed",borderRadius:6,background:connMode?"#1E3A5F":"#0F172A",border:`1px solid ${connMode?"#2563EB":"#E5E7EB"}`,opacity:hasNodes?1:0.4,marginBottom:6,transition:"background .1s"}}
        onMouseEnter={e=>{if(hasNodes&&!connMode)e.currentTarget.style.background="#E5E7EB";}}
        onMouseLeave={e=>{if(!connMode)e.currentTarget.style.background="#0F172A";}}>
        <div style={{width:24,height:16,borderRadius:3,background:connMode?"#2563EB":"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700,flexShrink:0}}>→</div>
        <span style={{color:connMode?"#93C5FD":"#CBD5E1",fontSize:11,flex:1}}>
          {connMode?(connFrom?t.clickTarget:t.clickStart):t.connectionTool}
        </span>
      </div>
      <div style={{marginTop:4,fontSize:9,color:"#9CA3AF",lineHeight:1.7}}>
        <div>• Ctrl+C/V : copier/coller</div>
        <div>• Ctrl+D : dupliquer  • Suppr : effacer</div>
        <div>• Ctrl+] / [ : calque</div>
      </div>
    </div>
  );

  // ─── Auth loading screen ───────────────────────────────────────────────────
  if (authLoading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#F8FAFC',color:'#6B7280',flexDirection:'column',gap:16}}>
      <span style={{fontSize:32}}>🗺️</span>
      <span style={{fontSize:14}}>{t.loading}</span>
    </div>
  );

  // ─── Login screen ──────────────────────────────────────────────────────────
  if (!user) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#F3F4F6',fontFamily:"'Inter',system-ui,sans-serif"}}>
      {/* Language toggle */}
      <button onClick={()=>setLang(lang==='fr'?'en':'fr')}
        style={{position:'fixed',top:16,right:16,background:'#FFFFFF',border:'1px solid #E5E7EB',borderRadius:8,padding:'6px 14px',cursor:'pointer',color:'#374151',fontSize:12,fontWeight:600,display:'flex',alignItems:'center',gap:6,boxShadow:'0 1px 4px rgba(0,0,0,.08)'}}
        onPointerEnter={e=>(e.currentTarget.style.background='#F9FAFB')}
        onPointerLeave={e=>(e.currentTarget.style.background='#FFFFFF')}>
        <span style={{fontSize:15}}>{lang==='fr'?'🇬🇧':'🇫🇷'}</span>{t.switchLang}
      </button>

      <div style={{background:'#FFFFFF',border:'1px solid #E5E7EB',borderRadius:16,padding:'40px 48px',textAlign:'center',maxWidth:400,boxShadow:'0 4px 24px rgba(0,0,0,.08)',width:'100%',margin:'0 16px'}}>
        {/* Logo */}
        <div style={{width:52,height:52,borderRadius:14,background:'#2563EB',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 2px 8px rgba(37,99,235,.3)'}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><line x1="9" y1="3" x2="9" y2="18" stroke="white" strokeWidth="2"/><line x1="15" y1="6" x2="15" y2="21" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div style={{color:'#111827',fontWeight:800,fontSize:22,marginBottom:4}}>Customer Journey Mapper</div>
        <div style={{color:'#6B7280',fontSize:13,marginBottom:28,lineHeight:1.6}}>{t.tagline}</div>
        <button onClick={signInWithGoogle} style={{width:'100%',background:'#fff',border:'1.5px solid #E5E7EB',color:'#111827',borderRadius:10,padding:'12px 20px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:12,fontSize:14,fontWeight:600,boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
          {t.signInGoogle}
        </button>
        {/* Footer — version + changelog link */}
        <div style={{marginTop:24,paddingTop:20,borderTop:'1px solid #F1F5F9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:11,color:'#D1D5DB',fontWeight:500}}>v{CHANGELOG[0].version}</span>
          <button onClick={()=>setShowChangelog(true)}
            style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF',fontSize:12,display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:6}}
            onPointerEnter={e=>{(e.currentTarget as HTMLElement).style.color='#2563EB';(e.currentTarget as HTMLElement).style.background='#EFF6FF';}}
            onPointerLeave={e=>{(e.currentTarget as HTMLElement).style.color='#9CA3AF';(e.currentTarget as HTMLElement).style.background='none';}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="5"/><line x1="6.5" y1="4.5" x2="6.5" y2="7"/><circle cx="6.5" cy="9" r=".6" fill="currentColor" stroke="none"/>
            </svg>
            {lang==='fr'?'Mises à jour':"What's new"}
          </button>
        </div>
      </div>
      {showChangelog&&<ChangelogModal onClose={()=>setShowChangelog(false)}/>}
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#F8FAFC",fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden"}}>

      {/* ── MAP IT MODAL ─────────────────────────────────────────────────── */}
      {showMapIt&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowMapIt(false)}>
          <div style={{background:"#F8FAFC",borderRadius:14,width:700,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.5)"}} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{background:"#FFFFFF",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:"14px 14px 0 0"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/><line x1="9" y1="3" x2="9" y2="18" stroke="white" strokeWidth="1.8"/><line x1="15" y1="6" x2="15" y2="21" stroke="white" strokeWidth="1.8"/></svg>
                <span style={{color:"#111827",fontWeight:800,fontSize:16}}>MAP IT</span>
                <span style={{color:"#9CA3AF",fontSize:12}}>{t.mapItSubtitle}</span>
              </div>
              <button onClick={()=>setShowMapIt(false)} style={{background:"#F3F4F6",border:"none",color:"#6B7280",cursor:"pointer",width:30,height:30,borderRadius:8,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            {/* Tabs */}
            <MapItTabs addNodeCentered={addNodeCentered} customLabels={customLabels} />
          </div>
        </div>
      )}

      {deleteConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDeleteConfirm(null)}>
          <div style={{background:"#FFFFFF",borderRadius:12,padding:24,width:320,border:"1px solid #334155",boxShadow:"0 20px 60px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:24,marginBottom:10,textAlign:"center"}}>🗑️</div>
            <div style={{color:"#111827",fontWeight:700,fontSize:15,marginBottom:8,textAlign:"center"}}>{t.confirmDelete}</div>
            <div style={{color:"#6B7280",fontSize:13,marginBottom:20,textAlign:"center",lineHeight:1.5}}>{deleteConfirm.message}</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:"#F3F4F6",border:"none",color:"#111827",padding:"10px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>{t.cancel}</button>
              <button onClick={()=>{deleteConfirm.onConfirm();setDeleteConfirm(null);}} style={{flex:1,background:"#d82c0d",border:"none",color:"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700}}>{t.delete}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR — Edge design: 3 zones [Logo+Campaign | Tools | User] */}
      <div style={{height:48,background:"#FFFFFF",borderBottom:"1px solid #E5E7EB",display:"flex",alignItems:"stretch",flexShrink:0,overflow:"visible",position:"relative",zIndex:100}}>

        {/* ── ZONE LEFT: Logo + Campaign ────────────────────────── */}
        <div style={{display:"flex",alignItems:"center",padding:"0 14px",gap:10,borderRight:"1px solid #E5E7EB",flexShrink:0,minWidth:0}}>
          {/* Mobile hamburger */}
          {isMobile&&(
            <button onClick={()=>setSidebarOpen(s=>!s)}
              style={{width:30,height:30,background:sidebarOpen?"#EFF6FF":"transparent",border:"none",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#374151"}}>
              {sidebarOpen
                ?<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>
                :<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="3.5" x2="12" y2="3.5"/><line x1="2" y1="7" x2="12" y2="7"/><line x1="2" y1="10.5" x2="12" y2="10.5"/></svg>
              }
            </button>
          )}
          {/* Logo mark */}
          <div style={{width:28,height:28,borderRadius:7,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 4px rgba(37,99,235,.35)"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><line x1="9" y1="3" x2="9" y2="18" stroke="white" strokeWidth="2"/><line x1="15" y1="6" x2="15" y2="21" stroke="white" strokeWidth="2"/></svg>
          </div>
          {/* Campaign selector */}
          <div style={{position:"relative",flexShrink:0,minWidth:0}}>
            <button onClick={()=>setShowCampMenu(s=>!s)}
              style={{background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:0,padding:"2px 4px",borderRadius:6,minWidth:0}}
              onPointerEnter={e=>(e.currentTarget as HTMLElement).style.background="#F9FAFB"}
              onPointerLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
              <span style={{fontSize:9,fontWeight:600,color:"#9CA3AF",letterSpacing:.4,textTransform:"uppercase",lineHeight:1.2}}>CAMPAGNE</span>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:13,fontWeight:700,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180}}>{campName}</span>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </button>
            {showCampMenu&&(
              <div style={{position:"fixed",top:54,left:12,background:"#FFFFFF",border:"1px solid #E5E7EB",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:9000,minWidth:240,overflow:"hidden"}}>
                {campaigns.map(c=>(
                  <div key={c.id}
                    onClick={()=>{if(renamingCampId!==c.id&&c.id!==activeCampId)switchCampaign(c);}}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"10px 12px",background:c.id===activeCampId?"#EFF6FF":"transparent",borderBottom:"1px solid #F1F5F9",cursor:c.id===activeCampId?"default":"pointer",minHeight:44}}
                    onPointerEnter={e=>{if(c.id!==activeCampId)(e.currentTarget as HTMLElement).style.background="#F9FAFB";}}
                    onPointerLeave={e=>{if(c.id!==activeCampId)(e.currentTarget as HTMLElement).style.background="transparent";}}>
                    <span style={{fontSize:12,color:"#2563EB",flexShrink:0}}>{c.id===activeCampId?"▶":"○"}</span>
                    {renamingCampId===c.id
                      ?<input autoFocus value={renameVal}
                          onChange={e=>setRenameVal(e.target.value)}
                          onBlur={()=>renameCampaign(c.id,renameVal.trim()||c.name)}
                          onKeyDown={e=>{if(e.key==="Enter")renameCampaign(c.id,renameVal.trim()||c.name);if(e.key==="Escape")setRenamingCampId(null);}}
                          onClick={e=>e.stopPropagation()}
                          style={{flex:1,background:"#F9FAFB",border:"1px solid #2563EB",color:"#111827",borderRadius:4,padding:"2px 6px",fontSize:12,outline:"none"}}/>
                      :<span style={{flex:1,color:"#111827",fontSize:13,fontWeight:c.id===activeCampId?700:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                    }
                    <button onClick={e=>{e.stopPropagation();setRenamingCampId(c.id);setRenameVal(c.name);}}
                      style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",padding:"4px 6px",flexShrink:0,fontSize:14}} title={t.rename}>✏️</button>
                    {campaigns.length>1&&<button onClick={e=>{e.stopPropagation();deleteCampaign(c.id);}}
                      style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",padding:"4px 6px",flexShrink:0,fontSize:14}} title={t.delete}>🗑</button>}
                  </div>
                ))}
                <div onClick={addCampaign}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"12px",cursor:"pointer",color:"#2563EB",fontSize:13,fontWeight:600,minHeight:44}}
                  onPointerEnter={e=>(e.currentTarget as HTMLElement).style.background="#EFF6FF"}
                  onPointerLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                  <span style={{fontSize:16,fontWeight:700}}>+</span>
                  <span>{t.newCampaign}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── ZONE CENTER: Tools ────────────────────────────────── */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:2,padding:"0 8px",overflow:"hidden"}}>
          {/* Layout */}
          <button onClick={autoLayout} disabled={!hasNodes} title="Auto-layout"
            style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:7,border:"none",background:"transparent",color:hasNodes?"#374151":"#D1D5DB",cursor:hasNodes?"pointer":"not-allowed",fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}
            onPointerEnter={e=>{if(hasNodes){(e.currentTarget as HTMLElement).style.background="#EFF6FF";(e.currentTarget as HTMLElement).style.color="#2563EB";}}}
            onPointerLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color=hasNodes?"#374151":"#D1D5DB";}}>
            <span style={{fontSize:13}}>⬡</span><span>Layout</span>
          </button>

          <div style={{width:1,height:18,background:"#E5E7EB",margin:"0 2px",flexShrink:0}}/>

          {/* PDF */}
          <button onClick={exportPDF} disabled={isExporting} title="Exporter PDF"
            style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:7,border:"none",background:isExporting?"#FEF2F2":"transparent",color:isExporting?"#DC2626":"#374151",cursor:isExporting?"wait":"pointer",fontSize:12,fontWeight:500,whiteSpace:"nowrap",opacity:isExporting?0.7:1}}
            onPointerEnter={e=>{if(!isExporting){(e.currentTarget as HTMLElement).style.background="#FEF2F2";(e.currentTarget as HTMLElement).style.color="#DC2626";} }}
            onPointerLeave={e=>{if(!isExporting){(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="#374151";}}}>
            {isExporting
              ?<><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><circle cx="7" cy="7" r="5" strokeDasharray="20" strokeDashoffset="10" style={{animation:"spin 1s linear infinite",transformOrigin:"50% 50%"}}/></svg><span>PDF…</span></>
              :<><svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 1h8l4 4v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="0.75"/>
                  <path d="M9 1l4 4H9.5a.5.5 0 0 1-.5-.5V1z" fill="#D1D5DB"/>
                  <rect x="1" y="8" width="14" height="6.5" rx="1" fill="#DC2626"/>
                  <text x="8" y="12.6" fontSize="4.5" fontWeight="800" fill="white" textAnchor="middle" fontFamily="Arial,sans-serif" letterSpacing="0.3">PDF</text>
                </svg><span>PDF</span></>
            }
          </button>

          {/* Versions */}
          <button onClick={()=>{setShowVersions(s=>!s);setShowBrief(false);}}
            style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:7,border:"none",background:showVersions?"#EFF6FF":"transparent",color:showVersions?"#2563EB":"#374151",cursor:"pointer",fontSize:12,fontWeight:showVersions?700:500,whiteSpace:"nowrap"}}
            onPointerEnter={e=>{if(!showVersions){(e.currentTarget as HTMLElement).style.background="#EFF6FF";(e.currentTarget as HTMLElement).style.color="#2563EB";}}}
            onPointerLeave={e=>{if(!showVersions){(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="#374151";}}}>
            <span>📦</span><span>{t.versions}</span>
            {versions.length>0&&<span style={{background:showVersions?"#DBEAFE":"#F3F4F6",color:showVersions?"#1D4ED8":"#6B7280",borderRadius:10,padding:"0 5px",fontSize:10,fontWeight:700}}>{versions.length}</span>}
          </button>

          {/* Brief */}
          <button onClick={()=>{setShowBrief(s=>!s);setShowVersions(false);}}
            style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:7,border:"none",background:showBrief?"#FFF7ED":"transparent",color:showBrief?"#F97316":"#374151",cursor:"pointer",fontSize:12,fontWeight:showBrief?700:500,whiteSpace:"nowrap"}}
            onPointerEnter={e=>{if(!showBrief){(e.currentTarget as HTMLElement).style.background="#FFF7ED";(e.currentTarget as HTMLElement).style.color="#F97316";}}}
            onPointerLeave={e=>{if(!showBrief){(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="#374151";}}}>
            <span>📋</span><span>{t.brief}</span>
          </button>
        </div>

        {/* ── ZONE RIGHT: Avatar ────────────────────────────────── */}
        <div style={{display:"flex",alignItems:"center",padding:"0 14px",borderLeft:"1px solid #E5E7EB",flexShrink:0}}>
          <AvatarPill user={user} onSignOut={signOut} />
        </div>
      </div>

      {vMsg&&<div style={{position:"fixed",top:58,left:"50%",transform:"translateX(-50%)",background:vMsg.type==="ok"?"#D1FAE5":vMsg.type==="err"?"#FEE2E2":"#DBEAFE",color:vMsg.type==="ok"?"#065F46":vMsg.type==="err"?"#991B1B":"#1E40AF",padding:"8px 18px",borderRadius:20,fontSize:12,fontWeight:600,zIndex:9998,pointerEvents:"none",border:`1px solid ${vMsg.type==="ok"?"#A7F3D0":vMsg.type==="err"?"#FECACA":"#BFDBFE"}`,boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>{vMsg.text}</div>}

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>

        {/* ── SIDEBAR backdrop (mobile overlay) ─────────────────────────────── */}
        {isMobile&&sidebarOpen&&(
          <div onClick={()=>setSidebarOpen(false)}
            style={{position:'fixed',inset:0,top:46,background:'rgba(0,0,0,.55)',zIndex:499}}/>
        )}

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div style={{
          ...(isMobile?{
            position:'fixed',top:46,left:0,bottom:0,
            width:sidebarOpen?Math.min(280,sidebarW):0,
            zIndex:500,flexShrink:0,
          }:{
            width:sidebarOpen?sidebarW:44,
            flexShrink:0,position:'relative',
          }),
          background:"#FFFFFF",
          borderRight:"1px solid #2D3F55",
          display:"flex",flexDirection:"column",
          overflow:'hidden',
          transition:'width .22s cubic-bezier(.4,0,.2,1)',
        }}>

          {/* Desktop: resize handle (expanded only) */}
          {!isMobile&&sidebarOpen&&(
            <div onMouseDown={e=>{e.preventDefault();e.stopPropagation();sidebarDrag.current=true;document.body.style.cursor="col-resize";document.body.style.userSelect="none";}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,.4)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              style={{position:"absolute",right:0,top:0,bottom:0,width:5,cursor:"col-resize",zIndex:20,background:"transparent"}}/>
          )}

          {/* Desktop: icon strip shown when collapsed */}
          {!isMobile&&(
            <div style={{
              position:'absolute',top:0,left:0,width:44,height:'100%',
              display:'flex',flexDirection:'column',alignItems:'center',
              paddingTop:10,gap:2,zIndex:5,
              opacity:sidebarOpen?0:1,
              pointerEvents:sidebarOpen?'none':'auto',
              transition:'opacity .12s ease',
            }}>
              {/* Expand chevron */}
              <button onClick={()=>setSidebarOpen(true)} title="Expand sidebar"
                style={{width:32,height:32,background:'none',border:'none',color:'#9CA3AF',cursor:'pointer',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:4}}
                onPointerEnter={e=>(e.currentTarget.style.background='#E5E7EB')}
                onPointerLeave={e=>(e.currentTarget.style.background='none')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="5 2 10 7 5 12"/></svg>
              </button>
              {/* Section icons */}
              {SIDEBAR_SECTIONS.map(s=>(
                <button key={s.key} onClick={()=>setSidebarOpen(true)}
                  title={(t as any)[s.sectionKey]||s.label}
                  style={{width:36,height:36,background:'none',border:'none',color:'#9CA3AF',cursor:'pointer',borderRadius:6,fontSize:17,display:'flex',alignItems:'center',justifyContent:'center'}}
                  onPointerEnter={e=>{e.currentTarget.style.background='#E5E7EB';(e.currentTarget as HTMLElement).style.color='#94A3B8';}}
                  onPointerLeave={e=>{e.currentTarget.style.background='none';(e.currentTarget as HTMLElement).style.color='#64748B';}}>
                  {s.icon}
                </button>
              ))}
            </div>
          )}

          {/* Full sidebar content — always in DOM, opacity + pointerEvents control visibility */}
          <div style={{
            display:'flex',flexDirection:'column',flex:1,
            minWidth:isMobile?undefined:sidebarW, // prevent squishing during animation
            opacity:sidebarOpen?1:0,
            pointerEvents:sidebarOpen?'auto':'none',
            transition:'opacity .12s ease',
          }}>
            {/* Header: MAP IT button + collapse button */}
            <div style={{padding:"10px 10px 8px",borderBottom:"1px solid #2D3F55",display:'flex',gap:6,alignItems:'center'}}>
              <button onClick={()=>setShowMapIt(s=>!s)} style={{flex:1,background:showMapIt?"#2563EB":"linear-gradient(135deg,#1E3A5F,#1E4080)",border:`1px solid ${showMapIt?"#2563EB":"#2D4F80"}`,color:"#fff",borderRadius:8,padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:12,fontWeight:700,boxShadow:showMapIt?"0 0 0 2px rgba(59,130,246,.4)":"0 2px 8px rgba(0,0,0,.3)",transition:"all .15s"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/><line x1="9" y1="3" x2="9" y2="18" stroke="white" strokeWidth="1.8"/><line x1="15" y1="6" x2="15" y2="21" stroke="white" strokeWidth="1.8"/><circle cx="20" cy="4" r="4" fill="#22C55E"/><line x1="20" y1="2" x2="20" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="4" x2="22" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span>MAP IT</span>
              </button>
              {/* Collapse toggle */}
              <button onClick={()=>setSidebarOpen(false)}
                title={isMobile?"Close":"Collapse sidebar"}
                style={{width:32,height:32,background:'none',border:'1px solid #2D3F55',color:'#9CA3AF',cursor:'pointer',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
                onPointerEnter={e=>(e.currentTarget.style.background='#E5E7EB')}
                onPointerLeave={e=>(e.currentTarget.style.background='none')}>
                {isMobile
                  ?<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="12" y2="12"/><line x1="12" y1="1" x2="1" y2="12"/></svg>
                  :<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 2 4 6.5 9 11"/></svg>
                }
              </button>
            </div>

            {/* Scrollable node list */}
            <div style={{flex:1,overflowY:"auto"}}>
              {SIDEBAR_SECTIONS.map(section=>{
                const collapsed=collapsedCats[section.key];

                // ── Special case: PAGES section shows all 12 page styles (like MapIt) ──
                if(section.key==="pages"){
                  return(
                    <div key={section.key} style={{borderBottom:"1px solid #E5E7EB"}}>
                      <div
                        onClick={()=>toggleCat(section.key)}
                        style={{padding:"9px 10px 6px",fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:.9,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",userSelect:"none",background:"#F9FAFB"}}
                        onPointerEnter={e=>(e.currentTarget as HTMLElement).style.background="#F3F4F6"}
                        onPointerLeave={e=>(e.currentTarget as HTMLElement).style.background="#F9FAFB"}>
                        <span>{(t as any)[section.sectionKey]||section.label}</span>
                        <span style={{fontSize:9,color:"#9CA3AF",transition:"transform .2s",display:"inline-block",transform:collapsed?"rotate(-90deg)":"rotate(0deg)"}}>▼</span>
                      </div>
                      {!collapsed&&(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,padding:"8px"}}>
                          {PAGE_STYLES.map(ps=>{
                            const ptype="page_"+ps.id;
                            const plabel=(t as any)[ps.labelKey];
                            return(
                              <div key={ps.id}
                                draggable
                                onDragStart={e=>onSBDS(e,ptype)}
                                onClick={()=>addNodeCentered(ptype)}
                                onTouchStart={e=>{
                                  const t0=e.touches[0];
                                  sideDrag_.current={type:ptype,label:plabel,startX:t0.clientX,startY:t0.clientY,clientX:t0.clientX,clientY:t0.clientY,started:false,ghost:null};
                                }}
                                style={{cursor:"grab",borderRadius:8,border:"1px solid #E5E7EB",background:"#fff",padding:"6px 4px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"border-color .12s,box-shadow .12s"}}
                                onPointerEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#2563EB";(e.currentTarget as HTMLElement).style.boxShadow="0 2px 8px rgba(37,99,235,.12)";}}
                                onPointerLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#E5E7EB";(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                                <div style={{width:"100%",aspectRatio:"86/108",borderRadius:4,overflow:"hidden",flexShrink:0,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                  {ps.thumb(t)}
                                </div>
                                <span style={{fontSize:9,color:"#374151",textAlign:"center",lineHeight:1.25,fontWeight:500}}>{plabel}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const allItems=section.cats.flatMap(c=>ND.filter(d=>d.cat===c.k));
                if(!allItems.length)return null;
                return(
                  <div key={section.key} style={{borderBottom:"1px solid #E5E7EB"}}>
                    <div
                      onClick={()=>toggleCat(section.key)}
                      style={{padding:"9px 10px 6px",fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:.9,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",userSelect:"none",background:"#F9FAFB"}}
                      onPointerEnter={e=>(e.currentTarget as HTMLElement).style.background="#F3F4F6"}
                      onPointerLeave={e=>(e.currentTarget as HTMLElement).style.background="#F9FAFB"}>
                      <span>{(t as any)[section.sectionKey]||section.label}</span>
                      <span style={{fontSize:9,color:"#9CA3AF",transition:"transform .2s",display:"inline-block",transform:collapsed?"rotate(-90deg)":"rotate(0deg)"}}>▼</span>
                    </div>
                    {!collapsed&&section.cats.map(catDef=>{
                      const items=ND.filter(d=>d.cat===catDef.k);
                      if(!items.length)return null;
                      return(
                        <div key={catDef.k}>
                          {catDef.subKey&&(
                            <div style={{padding:"5px 10px 3px",display:"flex",alignItems:"center",gap:6}}>
                              <div style={{flex:1,height:1,background:"#E5E7EB"}}/>
                              <span style={{fontSize:8.5,fontWeight:600,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:.7,whiteSpace:"nowrap"}}>{(t as any)[catDef.subKey]||catDef.sub}</span>
                              <div style={{flex:1,height:1,background:"#E5E7EB"}}/>
                            </div>
                          )}
                          {items.map(d=>{
                            const dl=getDL(d.type,customLabels);
                            return(
                              <div key={d.type} draggable={editingType!==d.type} onDragStart={editingType!==d.type?(e=>onSBDS(e,d.type)):undefined}
                                onPointerEnter={()=>setHoveredType(d.type)} onPointerLeave={()=>setHoveredType(null)}
                                onTouchStart={editingType!==d.type?e=>{
                                  const t0=e.touches[0];
                                  sideDrag_.current={type:d.type,label:getDL(d.type,customLabels),startX:t0.clientX,startY:t0.clientY,clientX:t0.clientX,clientY:t0.clientY,started:false,ghost:null};
                                }:undefined}
                                style={{display:"flex",alignItems:"center",gap:7,padding:"4px 8px",cursor:editingType===d.type?"default":"grab",borderRadius:6,margin:"0 4px 1px",background:hoveredType===d.type&&editingType!==d.type?"#E5E7EB":"transparent",transition:"background .1s"}}>
                                <div style={{width:26,height:26,flexShrink:0,position:"relative"}}>
                                  <div style={{width:26,height:26,borderRadius:d.sh==="circle"?13:d.sh==="browser"?3:2,background:d.sh==="browser"?"#054547":d.sh==="textbox"?"transparent":(d.bg||"#2563EB"),transform:d.sh==="diamond"?"rotate(45deg) scale(.6)":"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:d.fg||"#fff",overflow:"hidden",border:d.sh==="textbox"?"1.5px dashed #9CA3AF":"none"}}>
                                    {d.sh==="textbox"?<span style={{color:"#6B7280",fontSize:9,fontWeight:800}}>Aa</span>
                                      :d.sh==="browser"?<span style={{fontSize:7,color:"#fff"}}>📄</span>
                                      :<div style={{transform:d.sh==="diamond"?"rotate(-45deg)":"none",display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%"}}>
                                        {LOGOS[d.type]
                                          ?React.cloneElement(LOGOS[d.type],{width:20,height:20,style:{display:"block"}})
                                          :<span style={{fontSize:10,fontWeight:700}}>{d.icon||"?"}</span>}
                                      </div>
                                    }
                                  </div>
                                  {d.cat==="src_payant"&&<div style={{position:"absolute",bottom:-1,right:-1,width:12,height:12,borderRadius:"50%",background:d.bg||"#2563EB",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"#fff",lineHeight:1,zIndex:10,boxShadow:"0 1px 2px rgba(0,0,0,.25)"}}>$</div>}
                                </div>
                                {editingType===d.type?(
                                  <input value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={finishEdit} onKeyDown={e=>{if(e.key==="Enter")finishEdit();if(e.key==="Escape")setEditingType(null);}} autoFocus onClick={e=>e.stopPropagation()} style={{background:"#F8FAFC",border:"1px solid #3B82F6",color:"#111827",borderRadius:4,padding:"2px 5px",fontSize:11,outline:"none",flex:1,fontFamily:"inherit"}}/>
                                ):(
                                  <>
                                    <span style={{color:"#374151",fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl}</span>
                                    {d.type!=="page"&&<button onClick={e=>{e.stopPropagation();setEditingType(d.type);setEditVal(dl);}} style={{opacity:hoveredType===d.type?1:0,background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:11,padding:"0 2px",flexShrink:0}}>✏️</button>}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Arrow tool pinned at bottom */}
            <ArrowToolBar/>
          </div>
        </div>

        {/* ── CANVAS ───────────────────────────────────────────────────────── */}
        <div ref={cvRef} className="cvbg" onMouseDown={onCvMD} onDragOver={e=>e.preventDefault()} onDrop={onCvDrop}
          style={{flex:1,position:"relative",overflow:"hidden",background:"#FFFFFF",cursor:connMode||connectAllMode?"crosshair":"grab",
            touchAction:"none",
            backgroundImage:`linear-gradient(to right,#D8DCE8 1px,transparent 1px),linear-gradient(to bottom,#D8DCE8 1px,transparent 1px)`,
            backgroundSize:`${120*zoom}px ${120*zoom}px`,backgroundPosition:`${pan.x}px ${pan.y}px`}}>
          <div style={{position:"absolute",transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"0 0"}}>
            <svg style={{position:"absolute",top:0,left:0,width:8000,height:5000,overflow:"visible",pointerEvents:"none"}}><g style={{pointerEvents:"all"}}>{conns.map(rConn)}</g></svg>
            {nodes.map((node,nodeIdx)=>{
              const d=gd(node.type);const isSel=selN.includes(node.id);const isCS=connFrom===node.id;
              const zIdx=(nodeIdx+1)*2+(isSel?nodes.length*2:0);
              if(node.type==="textbox"){
                const w=node.width||200,h=node.height||80;const isEd=editingTextId===node.id;
                const ts={fontFamily:node.font||"'Inter',system-ui,sans-serif",fontSize:node.size||14,color:node.color||"#1E293B",fontWeight:node.bold?700:400,fontStyle:node.italic?"italic":"normal",textDecoration:node.underline?"underline":"none",textAlign:node.align||"left",lineHeight:1.5};
                return(
                  <div key={node.id} data-nodeid={node.id} style={{position:"absolute",left:node.x,top:node.y,zIndex:zIdx}}
                    onMouseDown={e=>onNMD(e,node.id)} onClick={e=>onNClick(e,node.id)} onDoubleClick={e=>onNDbl(e,node.id)}>
                    <div style={{width:w,height:h,border:isSel?"2px solid #3B82F6":"1.5px dashed #94A3B8",borderRadius:6,background:node.bgColor||"transparent",boxShadow:isSel?"0 0 0 3px rgba(59,130,246,.2)":"none",cursor:connMode||connectAllMode?"crosshair":isEd?"text":"move",position:"relative",overflow:"hidden"}}>
                      {isEd?(
                        <textarea autoFocus value={node.text||""} onChange={e=>upN(node.id,{text:e.target.value})}
                          onBlur={()=>setEditingTextId(null)} onClick={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}
                          style={{...ts,position:"absolute",inset:0,width:"100%",height:"100%",border:"none",outline:"none",background:"transparent",resize:"none",padding:"8px"}}/>
                      ):(
                        <div style={{...ts,padding:"8px",whiteSpace:"pre-wrap",wordBreak:"break-word",width:"100%",height:"100%",userSelect:"none"}}>
                          {node.text||<span style={{color:"#6B7280",fontStyle:"italic",fontSize:12,fontWeight:400}}>{t.dblClickEdit}...</span>}
                        </div>
                      )}
                    </div>
                    {isSel&&!isEd&&<>
                      {/* Textbox: corner + edge handles like other nodes */}
                      {[
                        {mode:"nw",s:{top:-5,left:-5,cursor:"nwse-resize"}},
                        {mode:"n", s:{top:-5,left:"50%",marginLeft:-5,cursor:"ns-resize"}},
                        {mode:"ne",s:{top:-5,right:-5,cursor:"nesw-resize"}},
                        {mode:"e", s:{top:"50%",marginTop:-5,right:-5,cursor:"ew-resize"}},
                        {mode:"se",s:{bottom:-5,right:-5,cursor:"nwse-resize"}},
                        {mode:"s", s:{bottom:-5,left:"50%",marginLeft:-5,cursor:"ns-resize"}},
                        {mode:"sw",s:{bottom:-5,left:-5,cursor:"nesw-resize"}},
                        {mode:"w", s:{top:"50%",marginTop:-5,left:-5,cursor:"ew-resize"}},
                      ].map(hd=>(
                        <div key={hd.mode}
                          onMouseDown={e=>{e.stopPropagation();document.body.style.cursor=hd.s.cursor;document.body.style.userSelect="none";
                            const ox=node.x,oy=node.y;
                            tbResize.current={id:node.id,ow:w,oh:h,ox,oy,mx:e.clientX,my:e.clientY,pNodes:nodes,pConns:conns,mode:hd.mode,
                              legacy:false};
                          }}
                          onClick={e=>e.stopPropagation()}
                          style={{position:"absolute",width:10,height:10,background:"#fff",border:"2px solid #3B82F6",borderRadius:2,zIndex:20,...hd.s}}
                        />
                      ))}
                    </>}
                  </div>
                );
              }
              const{w,h}=gs(d,node);
              const SC="#82235F"; // selection color
              const PAD=20;       // padding inside frame
              const hS=10;        // corner handle size
              const showFrame=isSel&&!connMode&&!connectAllMode;
              const fw=w+PAD*2, fh=h+PAD*2; // frame dimensions
              const LABEL_H=36; // reserved space above for label always
              return(
                <div key={node.id} data-nodeid={node.id} style={{position:"absolute",left:node.x-PAD,top:node.y-PAD-LABEL_H,width:fw,height:fh+LABEL_H,zIndex:zIdx}}
                  onMouseDown={e=>onNMD(e,node.id)} onClick={e=>onNClick(e,node.id)}>
                  {/* Label — always above the frame, same position selected or not */}
                  <div style={{position:"absolute",
                    top:0,height:LABEL_H,
                    left:"50%",transform:"translateX(-50%)",
                    width:Math.max(fw,120),textAlign:"center",
                    fontSize:16,fontWeight:700,
                    color:"#667287",
                    lineHeight:1.35,pointerEvents:"none",
                    display:"flex",alignItems:"flex-end",justifyContent:"center",
                    paddingBottom:6,
                    whiteSpace:"normal",wordBreak:"break-word",
                    zIndex:40}}>
                    {node.label}
                  </div>
                  {/* Node — offset inside frame, below label */}
                  <div style={{position:"absolute",left:PAD,top:PAD+LABEL_H,width:w,height:h}}>
                    <NShape d={d} node={node} sel={false} cs={isCS} cm={connMode||connectAllMode} w={w} h={h} t={t}/>
                  </div>
                  {/* Selection frame — positioned below the label */}
                  {showFrame&&<>
                    <svg style={{position:"absolute",top:LABEL_H,left:0,width:fw,height:fh,pointerEvents:"none",zIndex:20}} overflow="visible">
                      <rect x={1} y={1} width={fw-2} height={fh-2} fill="none" stroke={SC} strokeWidth={1.5}/>
                    </svg>
                    {/* 4 corner handles centered on frame corners */}
                    {[
                      {mode:"nw",t:LABEL_H-hS/2,     l:-hS/2,      b:null, r:null,  cursor:"nwse-resize"},
                      {mode:"ne",t:LABEL_H-hS/2,     l:null,       b:null, r:-hS/2, cursor:"nesw-resize"},
                      {mode:"se",t:LABEL_H+fh-hS/2,  l:null,       b:null, r:-hS/2, cursor:"nwse-resize"},
                      {mode:"sw",t:LABEL_H+fh-hS/2,  l:-hS/2,      b:null, r:null,  cursor:"nesw-resize"},
                    ].map(corner=>(
                      <div key={corner.mode}
                        {...mkH(node.id,corner.mode,w,h,node.x,node.y)}
                        onClick={e=>e.stopPropagation()}
                        style={{position:"absolute",width:hS,height:hS,
                          background:"transparent",border:`2px solid ${SC}`,
                          borderRadius:2,zIndex:30,
                          cursor:corner.cursor,
                          top:corner.t,left:corner.l??undefined,right:corner.r??undefined}}
                      />
                    ))}
                  </>}
                </div>
              );
            })}
          </div>
          {connMode&&<div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:"rgba(59,130,246,.93)",color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:12,fontWeight:600,pointerEvents:"none",zIndex:50}}>{connFrom?t.clickTarget:t.clickStart}</div>}
          {connectAllMode&&<div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:"rgba(124,58,237,.93)",color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:12,fontWeight:600,pointerEvents:"none",zIndex:50}}>🔗 {t.clickTarget}</div>}
          {selN.length>1&&!connectAllMode&&<div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"#DBEAFE",color:"#1D4ED8",padding:"6px 14px",borderRadius:8,fontSize:11,pointerEvents:"none",zIndex:50,border:"1px solid #2563EB"}}>✦ {selN.length} {t.nodesLabel}</div>}
          {selC&&!selN.length&&<div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"#FFFFFF",color:"#6B7280",padding:"6px 14px",borderRadius:8,fontSize:11,pointerEvents:"none",zIndex:50,border:"1px solid #334155"}}>{t.connSelected}</div>}
          {clipboard.length>0&&<div style={{position:"absolute",bottom:14,left:14,background:"#DBEAFE",color:"#60A5FA",padding:"4px 10px",borderRadius:6,fontSize:10,border:"1px solid #2563EB",pointerEvents:"none"}}>{clipboard.length} element{clipboard.length>1?"s":""} — Ctrl+V pour coller</div>}
          {activeVid&&(()=>{const v=versions.find(x=>x.id===activeVid);return v?(<div style={{position:"absolute",bottom:16,left:16,background:"#D1FAE5",color:"#059669",padding:"4px 10px",borderRadius:6,fontSize:10,border:"1px solid #166534",pointerEvents:"none",display:"flex",alignItems:"center",gap:5,zIndex:40}}><span>📦</span><span>{v.name}</span></div>):null;})()}
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
        {showRP&&(
          <div style={{width:240,background:"#FFFFFF",borderLeft:"1px solid #2D3F55",flexShrink:0,overflowY:"auto"}}>

            {/* MULTI */}
            {selN.length>1&&(
              <div style={{padding:"14px 14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div><div style={{color:"#111827",fontWeight:700,fontSize:13}}>{t.multiSelect}</div><div style={{color:"#6B7280",fontSize:11,marginTop:2}}>{selN.length} {t.nodesLabel}</div></div>
                  <button onClick={()=>setSelN([])} style={{background:"#F3F4F6",border:"none",color:"#6B7280",cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
                <SH>Actions</SH>
                <div style={{display:"flex",gap:4,marginBottom:10}}>
                  <button onClick={copySelected} style={btnCopy} onMouseEnter={e=>{e.currentTarget.style.background="#E5E7EB";e.currentTarget.style.borderColor="#475569";}} onMouseLeave={e=>{e.currentTarget.style.background="#0F172A";e.currentTarget.style.borderColor="#E5E7EB";}}>📋 Copier</button>
                  <button onClick={duplicateSelected} onMouseEnter={e=>e.currentTarget.style.background="#2563EB"} onMouseLeave={e=>e.currentTarget.style.background="#1E3A5F"} style={btnDup}>⎘ Dupliquer</button>
                </div>
                <LayerSection/>
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
                  <SH>Alignement</SH>
                  <div style={{display:"flex",gap:5,marginBottom:5}}><ActBtn onClick={alignV} icon="⬍" label={t.centerVert} disabled={false}/><ActBtn onClick={alignH} icon="⬌" label={t.centerHoriz} disabled={false}/></div>
                  <SH>Distribution {!can3&&<span style={{color:"#3D4F61",fontSize:9,fontWeight:400}}>(3 min.)</span>}</SH>
                  <div style={{display:"flex",gap:5,marginBottom:10}}><ActBtn onClick={distH} icon="↔" label={t.spaceHoriz} disabled={!can3}/><ActBtn onClick={distV} icon="↕" label={t.spaceVert} disabled={!can3}/></div>
                  <SH>Connexions</SH>
                  <button onClick={()=>setConnectAllMode(true)} style={{width:"100%",background:"#2D1F5E",border:"1px solid #4C1D95",color:"#C4B5FD",padding:"8px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔗 Connecter tous vers...</button>
                  <SH>Danger</SH>
                  <button onClick={()=>askDelete(`Supprimer ${selN.length} {t.nodesLabel} et leurs connexions ?`,deleteSel)}
                    onMouseEnter={e=>e.currentTarget.style.background="#b52209"} onMouseLeave={e=>e.currentTarget.style.background="#d82c0d"}
                    style={{width:"100%",background:"#d82c0d",border:"none",color:"#fff",padding:"8px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    🗑 Supprimer la selection
                  </button>
                </div>
              </div>
            )}

            {/* TEXTBOX */}
            {sn&&isTB&&(
              <div style={{padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div><div style={{color:"#111827",fontWeight:700,fontSize:13}}>{t.textBox}</div><div style={{color:"#6B7280",fontSize:11,marginTop:2}}>{t.dblClickEdit}</div></div>
                  <button onClick={()=>setSelN([])} style={{background:"#F3F4F6",border:"none",color:"#6B7280",cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
                <ConnPanel nodeId={sn.id}/>
                <LayerSection/>
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
                  <SH>Actions</SH>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={copySelected} style={btnCopy} onMouseEnter={e=>{e.currentTarget.style.background="#E5E7EB";e.currentTarget.style.borderColor="#475569";}} onMouseLeave={e=>{e.currentTarget.style.background="#0F172A";e.currentTarget.style.borderColor="#E5E7EB";}}>📋 Copier</button>
                    <button onClick={duplicateSelected} onMouseEnter={e=>e.currentTarget.style.background="#2563EB"} onMouseLeave={e=>e.currentTarget.style.background="#1E3A5F"} style={btnDup}>⎘ Dupliquer</button>
                    <button onClick={()=>askDelete("Supprimer cette zone de texte ?",()=>{saveH(nodes,conns,"histDelete","🗑");setNodes(p=>p.filter(n=>n.id!==sn.id));setConns(p=>p.filter(c=>c.from!==sn.id&&c.to!==sn.id));setSelN([]);})}
                      style={btnDel} onMouseEnter={e=>{e.currentTarget.style.background="#FEE2E2";}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>🗑</button>
                  </div>
                </div>
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
                  <label style={lbS}>Police</label>
                  <select value={sn.font||FONTS[0].v} onChange={e=>upN(sn.id,{font:e.target.value})} style={{...inS,marginBottom:8,cursor:"pointer"}}>{FONTS.map(f=><option key={f.v} value={f.v}>{f.label}</option>)}</select>
                  <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"flex-end"}}>
                    <div style={{flex:1}}><label style={lbS}>Taille</label><select value={sn.size||14} onChange={e=>upN(sn.id,{size:parseInt(e.target.value)})} style={{...inS,cursor:"pointer"}}>{SIZES.map(s=><option key={s} value={s}>{s}px</option>)}</select></div>
                    <div><label style={lbS}>Texte</label><ColorPicker value={sn.color||"#1E293B"} onChange={e=>upN(sn.id,{color:e.target.value})}/></div>
                  </div>
                  <label style={lbS}>Style</label>
                  <div style={{display:"flex",gap:4,marginBottom:8}}>
                    <button onClick={()=>upN(sn.id,{bold:!sn.bold})} style={{...togBtnS(sn.bold),width:36}}><b style={{fontFamily:"serif"}}>B</b></button>
                    <button onClick={()=>upN(sn.id,{italic:!sn.italic})} style={{...togBtnS(sn.italic),width:36}}><i>I</i></button>
                    <button onClick={()=>upN(sn.id,{underline:!sn.underline})} style={{...togBtnS(sn.underline),width:36}}><u>U</u></button>
                  </div>
                  <label style={lbS}>Alignement</label>
                  <div style={{display:"flex",gap:4,marginBottom:8}}>{["left","center","right"].map(a=>(<button key={a} onClick={()=>upN(sn.id,{align:a})} style={{...togBtnS((sn.align||"left")===a),flex:1,padding:"4px 0"}}><AlignIcon type={a}/></button>))}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:.5}}>Arriere-plan</span>
                    <Toggle on={!!sn.bgColor} onChange={()=>upN(sn.id,{bgColor:sn.bgColor?"":"#ffffff"})}/>
                  </div>
                  {sn.bgColor&&(<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><ColorPicker value={sn.bgColor} onChange={e=>upN(sn.id,{bgColor:e.target.value})}/><span style={{color:"#6B7280",fontSize:11}}>{sn.bgColor}</span></div>)}
                  <label style={{...lbS,marginTop:8}}>Lien URL</label>
                  <input value={sn.link||""} onChange={e=>upN(sn.id,{link:e.target.value})} placeholder="https://..." style={inS}/>
                </div>
              </div>
            )}

            {/* PAGE NODE */}
            {sn&&isPage&&(
              <div style={{padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div><div style={{color:"#111827",fontWeight:700,fontSize:13}}>📄 Page</div><div style={{color:"#6B7280",fontSize:11,marginTop:2}}>{t[getPageStyle(sn).labelKey]}</div></div>
                  <button onClick={()=>setSelN([])} style={{background:"#F3F4F6",border:"none",color:"#6B7280",cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
                <div style={{marginTop:0,paddingTop:0}}>
                  <label style={lbS}>Libelle</label>
                  <input value={sn.label||""} onChange={e=>upN(sn.id,{label:e.target.value})} onFocus={onEF} onBlur={onEB} style={{...inS,marginBottom:10}}/>
                  <label style={lbS}>Notes / URL</label>
                  <textarea value={sn.notes||""} onChange={e=>upN(sn.id,{notes:e.target.value})} onFocus={onEF} onBlur={onEB} rows={3} style={{...inS,resize:"vertical",lineHeight:1.5}}/>
                </div>
                <ConnPanel nodeId={sn.id}/>
                <LayerSection/>
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
                  <SH>Actions</SH>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={copySelected} style={btnCopy} onMouseEnter={e=>{e.currentTarget.style.background="#E5E7EB";e.currentTarget.style.borderColor="#475569";}} onMouseLeave={e=>{e.currentTarget.style.background="#0F172A";e.currentTarget.style.borderColor="#E5E7EB";}}>📋 Copier</button>
                    <button onClick={duplicateSelected} onMouseEnter={e=>e.currentTarget.style.background="#2563EB"} onMouseLeave={e=>e.currentTarget.style.background="#1E3A5F"} style={btnDup}>⎘ Dupliquer</button>
                    <button onClick={()=>askDelete("Supprimer cette page et ses connexions ?",()=>{saveH(nodes,conns,"histDelete","🗑");setNodes(p=>p.filter(n=>n.id!==sn.id));setConns(p=>p.filter(c=>c.from!==sn.id&&c.to!==sn.id));setSelN([]);})}
                      style={btnDel} onMouseEnter={e=>{e.currentTarget.style.background="#FEE2E2";}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>🗑</button>
                  </div>
                </div>
                <PageStyleSection node={sn}/>
              </div>
            )}

            {/* SINGLE NON-PAGE NODE */}
            {sn&&!isTB&&!isPage&&(
              <div style={{padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div><div style={{color:"#111827",fontWeight:700,fontSize:13}}>{(t as any)[snD?.labelKey]||snD?.label||"Node"}</div><div style={{color:"#6B7280",fontSize:11,marginTop:2}}>{t.nodeSelected}</div></div>
                  <button onClick={()=>setSelN([])} style={{background:"#F3F4F6",border:"none",color:"#6B7280",cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
                <div style={{marginTop:0}}>
                  <label style={lbS}>Libelle</label>
                  <input value={sn.label||""} onChange={e=>upN(sn.id,{label:e.target.value})} onFocus={onEF} onBlur={onEB} style={{...inS,marginBottom:10}}/>
                  <label style={lbS}>Notes / URL</label>
                  <textarea value={sn.notes||""} onChange={e=>upN(sn.id,{notes:e.target.value})} onFocus={onEF} onBlur={onEB} rows={3} style={{...inS,resize:"vertical",lineHeight:1.5}}/>
                </div>
                <ConnPanel nodeId={sn.id}/>
                <LayerSection/>
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #2D3F55"}}>
                  <SH>Actions</SH>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={copySelected} style={btnCopy} onMouseEnter={e=>{e.currentTarget.style.background="#E5E7EB";e.currentTarget.style.borderColor="#475569";}} onMouseLeave={e=>{e.currentTarget.style.background="#0F172A";e.currentTarget.style.borderColor="#E5E7EB";}}>📋 Copier</button>
                    <button onClick={duplicateSelected} onMouseEnter={e=>e.currentTarget.style.background="#2563EB"} onMouseLeave={e=>e.currentTarget.style.background="#1E3A5F"} style={btnDup}>⎘ Dupliquer</button>
                    <button onClick={()=>askDelete(`Supprimer "${sn.label}" et ses connexions ?`,()=>{saveH(nodes,conns,"histDelete","🗑");setNodes(p=>p.filter(n=>n.id!==sn.id));setConns(p=>p.filter(c=>c.from!==sn.id&&c.to!==sn.id));setSelN([]);})}
                      style={btnDel} onMouseEnter={e=>{e.currentTarget.style.background="#FEE2E2";}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>🗑</button>
                  </div>
                </div>
              </div>
            )}

            {/* CONNECTION */}
            {!sn&&selConn&&(
              <div style={{padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div><div style={{color:"#111827",fontWeight:700,fontSize:13}}>🔗 Connexion</div><div style={{color:"#6B7280",fontSize:11,marginTop:2}}>{gn(selConn.from)?.label||"?"} → {gn(selConn.to)?.label||"?"}</div></div>
                  <button onClick={()=>setSelC(null)} style={{background:"#F3F4F6",border:"none",color:"#6B7280",cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
                <SH>Actions</SH>
                <div style={{display:"flex",gap:4,marginBottom:10}}>
                  <button onClick={()=>{const c=conns.find(x=>x.id===selC);if(!c)return;saveH(nodes,conns,"histDuplicate","⧉");const nc={...c,id:cuid()};setConns(p=>[...p,nc]);setSelC(nc.id);}} style={{...btnCopy}} onMouseEnter={e=>{e.currentTarget.style.background="#E5E7EB";e.currentTarget.style.borderColor="#475569";}} onMouseLeave={e=>{e.currentTarget.style.background="#0F172A";e.currentTarget.style.borderColor="#E5E7EB";}}>📋 Copier</button>
                  <button onClick={()=>{const c=conns.find(x=>x.id===selC);if(!c)return;saveH(nodes,conns,"histDuplicate","⧉");const nc={...c,id:cuid()};setConns(p=>[...p,nc]);setSelC(nc.id);}} style={{...btnDup}} onMouseEnter={e=>e.currentTarget.style.background="#2563EB"} onMouseLeave={e=>e.currentTarget.style.background="#1E3A5F"}>⎘ Dupliquer</button>
                </div>
                <label style={lbS}>Style</label>
                <div style={{display:"flex",gap:5,marginBottom:8}}>
                  <button onClick={()=>{saveH(nodes,conns,"histConnStyle","⌒");upC(selC,{curved:true,midX:null,midY:null});}} style={{flex:1,height:30,background:selConn.curved!==false?"#1E3A5F":"#0F172A",border:`1px solid ${selConn.curved!==false?"#2563EB":"#E5E7EB"}`,color:selConn.curved!==false?"#fff":"#64748B",borderRadius:5,cursor:"pointer",fontSize:14}} title="Courbe">⌒</button>
                  <button onClick={()=>{saveH(nodes,conns,"histConnStyle","—");upC(selC,{curved:false,midX:null,midY:null});}} style={{flex:1,height:30,background:selConn.curved===false?"#1E3A5F":"#0F172A",border:`1px solid ${selConn.curved===false?"#2563EB":"#E5E7EB"}`,color:selConn.curved===false?"#fff":"#64748B",borderRadius:5,cursor:"pointer",fontSize:14,fontWeight:700}} title="Droite">—</button>
                </div>
                <label style={lbS}>Trait</label>
                <div style={{display:"flex",gap:6,marginBottom:12}}>
                  <button onClick={()=>{saveH(nodes,conns,"histConnStyle","—");upC(selC,{dashed:false});}} style={{flex:1,height:30,background:!selConn.dashed?"#1E3A5F":"#0F172A",border:`1px solid ${!selConn.dashed?"#2563EB":"#E5E7EB"}`,color:!selConn.dashed?"#fff":"#64748B",borderRadius:5,cursor:"pointer",fontSize:14,fontWeight:700}}>—</button>
                  <button onClick={()=>{saveH(nodes,conns,"histConnStyle","╌");upC(selC,{dashed:true});}} style={{flex:1,height:30,background:selConn.dashed?"#1E3A5F":"#0F172A",border:`1px solid ${selConn.dashed?"#2563EB":"#E5E7EB"}`,color:selConn.dashed?"#fff":"#64748B",borderRadius:5,cursor:"pointer",fontSize:12,letterSpacing:2}}>╌</button>
                </div>
                {selConn.midX!=null&&<button onClick={()=>{saveH(nodes,conns,"histConnStyle","↺");upC(selC,{midX:null,midY:null});}} style={{width:"100%",background:"#F8FAFC",border:"1px solid #334155",color:"#6B7280",padding:"5px",borderRadius:5,cursor:"pointer",fontSize:11,marginBottom:10}}>{t.resetCurve}</button>}
                <label style={lbS}>Couleur</label>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <ColorPicker value={selConn.color||"#94A3B8"} onChange={e=>{saveH(nodes,conns,"histConnColor","●");upC(selC,{color:e.target.value});}}/>
                  <span style={{color:"#6B7280",fontSize:11}}>{selConn.color||"#94A3B8"}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                  {ARROW_COLORS.map(color=><button key={color} onClick={()=>{saveH(nodes,conns,"histConnColor","●");upC(selC,{color});}} style={{width:28,height:28,borderRadius:"50%",background:color,border:(selConn.color||"#94A3B8")===color?"3px solid #F1F5F9":"3px solid transparent",cursor:"pointer",padding:0,boxSizing:"border-box"}}/>)}
                </div>
                <button onClick={()=>askDelete("Supprimer cette connexion ?",()=>{saveH(nodes,conns,"histDisconnect","✂");setConns(p=>p.filter(c=>c.id!==selC));setSelC(null);})}
                  onMouseEnter={e=>e.currentTarget.style.background="#b52209"} onMouseLeave={e=>e.currentTarget.style.background="#d82c0d"}
                  style={{width:"100%",background:"#d82c0d",border:"none",color:"#fff",padding:"9px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>🗑 Supprimer la connexion</button>
              </div>
            )}
          </div>
        )}

        {/* VERSIONS */}
        {showVersions&&(
          <div style={{position:"absolute",right:showRP?240:0,top:0,bottom:0,width:340,background:"#FFFFFF",borderLeft:"1px solid #2D3F55",display:"flex",flexDirection:"column",zIndex:50,boxShadow:"-4px 0 20px rgba(0,0,0,.4)"}}>
            <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #2D3F55",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{color:"#059669",fontWeight:700,fontSize:14}}>📦 Versions</span>
                <button onClick={()=>setShowVersions(false)} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:15}}>✕</button>
              </div>
              <div style={{display:"flex",gap:6}}>
                <input value={vName} onChange={e=>setVName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveVer()} placeholder={`${t.versionPlaceholder} ${versions.length+1}`} style={{...inS,flex:1,height:32,padding:"0 8px"}}/>
                <button onClick={saveVer} disabled={vLoading} style={{background:"#16A34A",border:"none",color:"#fff",padding:"0 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700,height:32,whiteSpace:"nowrap",opacity:vLoading?0.6:1}}>{vLoading?"...":("💾 "+t.save)}</button>
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
              {versions.length===0&&<div style={{padding:"40px 20px",textAlign:"center",color:"#9CA3AF",fontSize:12}}><div style={{fontSize:32,marginBottom:8}}>📭</div><div>{t.aucuneVersion}</div></div>}
              {[...versions].reverse().map(v=>{
                const isAct=activeVid===v.id;const isCf=confirmDel===v.id;
                return(<div key={v.id} style={{margin:"0 8px 6px",borderRadius:8,background:isAct?"rgba(22,163,74,.12)":"#0F172A",border:`1px solid ${isAct?"#A7F3D0":"#E5E7EB"}`}}>
                  <div style={{padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                        {isAct&&<span style={{background:"#D1FAE5",color:"#059669",borderRadius:4,padding:"1px 5px",fontSize:9,fontWeight:700}}>ACTIF</span>}
                        <span style={{color:"#111827",fontWeight:600,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.name}</span>
                      </div>
                      <div style={{color:"#9CA3AF",fontSize:10}}>{fmtDate(v.ts)}</div>
                    </div>
                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      <button onClick={()=>restoreVer(v)} disabled={vLoading||isAct} style={{background:isAct?"#E5E7EB":"#1E3A5F",border:"none",color:isAct?"#374151":"#60A5FA",padding:"4px 8px",borderRadius:5,cursor:isAct?"not-allowed":"pointer",fontSize:11,fontWeight:600,opacity:isAct?0.5:1}}>↩ Restaurer</button>
                      {!isCf?(<button onClick={()=>setConfirmDel(v.id)} style={{background:"#1A0A0A",border:"none",color:"#F87171",padding:"4px 6px",borderRadius:5,cursor:"pointer",fontSize:11}}>🗑</button>):(<div style={{display:"flex",gap:3,alignItems:"center"}}><span style={{color:"#F87171",fontSize:10}}>{t.confirmDelQ}</span><button onClick={()=>deleteVer(v.id)} style={{background:"#FEF2F2",border:"none",color:"#DC2626",padding:"3px 6px",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:700}}>{t.yes}</button><button onClick={()=>setConfirmDel(null)} style={{background:"#F3F4F6",border:"none",color:"#6B7280",padding:"3px 6px",borderRadius:4,cursor:"pointer",fontSize:10}}>{t.no}</button></div>)}
                    </div>
                  </div>
                </div>);
              })}
            </div>
            <div style={{padding:"10px 16px",borderTop:"1px solid #2D3F55",flexShrink:0,fontSize:10,color:"#374151",textAlign:"center"}}>{versions.length} version{versions.length!==1?"s":""} — persistees entre sessions</div>
          </div>
        )}

        {/* BRIEF */}
        {showBrief&&(
          <div style={{position:"absolute",right:showRP?240:0,top:0,bottom:0,width:308,background:"#FFFFFF",borderLeft:"1px solid #2D3F55",overflowY:"auto",padding:14,zIndex:50,boxShadow:"-4px 0 20px rgba(0,0,0,.35)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{color:"#F97316",fontWeight:700,fontSize:14}}>{t.briefTitle}</span>
              <button onClick={()=>setShowBrief(false)} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:15}}>✕</button>
            </div>
            {/* Brief initial paste zone */}
            <div style={{marginBottom:14,padding:12,background:"#F8FAFC",borderRadius:8,border:"1px solid #2D3F55"}}>
              <label style={{...lbS,color:"#F97316",marginBottom:6,display:"block"}}>{t.briefInitialLabel}</label>
              <textarea
                value={briefInitial}
                onChange={e=>setBriefInitial(e.target.value)}
                placeholder={t.briefPlaceholder}
                rows={6}
                style={{...inS,resize:"vertical",lineHeight:1.6,marginBottom:10,minHeight:100}}
              />
              <button
                onClick={generateMapping}
                disabled={generating}
                style={{width:"100%",background:generating?"#1E3A5F":"linear-gradient(135deg,#2563EB,#1E40AF)",border:"none",color:"#fff",borderRadius:8,padding:"10px",cursor:generating?"not-allowed":"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:generating?0.7:1,boxShadow:generating?"none":"0 2px 8px rgba(37,99,235,.4)"}}>
                {generating
                  ?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span><span>{t.briefGenerating}</span></>
                  :<><span>🤖</span><span>{t.briefGenerate}</span></>
                }
              </button>
              {genMsg&&<div style={{marginTop:8,padding:"6px 10px",borderRadius:6,fontSize:11,fontWeight:600,
                background:genMsg.type==="ok"?"#14532D":genMsg.type==="err"?"#7F1D1D":"#1E3A5F",
                color:genMsg.type==="ok"?"#4ADE80":genMsg.type==="err"?"#FCA5A5":"#93C5FD"}}>
                {genMsg.text}
              </div>}
            </div>
            <div style={{height:1,background:"#E5E7EB",marginBottom:14}}/>
            {[
              {k:"campagne",  l:t.briefCampaignName},
              {k:"site",      l:t.briefClientSite},
              {k:"objectif",  l:t.briefObjective,       m:true},
              {k:"dateDebut", l:t.briefStartDate},
              {k:"dateFin",   l:t.briefEndDate},
              {k:"annonce",   l:t.briefResultsDate},
              {k:"publicCible",l:t.briefTargetAudience, m:true},
              {k:"region",    l:t.briefTargetRegion},
              {k:"tonalite",  l:t.briefTone,            m:true},
              {k:"leadMagnet",l:t.briefLeadMagnet,      m:true},
              {k:"notes",     l:t.briefNotes,           m:true},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:10}}>
                <label style={lbS}>{f.l}</label>
                {f.m?<textarea value={brief[f.k]||""} onChange={e=>setBrief(b=>({...b,[f.k]:e.target.value}))} rows={2} style={{...inS,resize:"vertical",lineHeight:1.5}}/>:<input value={brief[f.k]||""} onChange={e=>setBrief(b=>({...b,[f.k]:e.target.value}))} style={inS}/>}
              </div>
            ))}
            <div>
              <label style={lbS}>{t.briefSources}</label>
              {(brief.sources||[]).map((s,i)=>(<div key={i} style={{display:"flex",gap:4,marginBottom:4}}><input value={s} onChange={e=>{const a=[...brief.sources];a[i]=e.target.value;setBrief(b=>({...b,sources:a}));}} style={{...inS,flex:1}}/><button onClick={()=>setBrief(b=>({...b,sources:b.sources.filter((_,j)=>j!==i)}))} style={{background:"#FEE2E2",border:"none",color:"#DC2626",padding:"0 6px",borderRadius:4,cursor:"pointer",fontSize:11}}>✕</button></div>))}
              <button onClick={()=>setBrief(b=>({...b,sources:[...(b.sources||[]),""]}))} style={{background:"#F3F4F6",border:"none",color:"#6B7280",padding:"4px 10px",borderRadius:4,cursor:"pointer",fontSize:11,marginTop:2}}>{t.briefAddSource}</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bee-style Undo / Redo + History timeline — bottom-left ── */}
      {(canUndo||canRedo||showHistory)&&(()=>{
        const histIcon={histAdd:"✚",histDelete:"🗑",histMove:"✥",histConnect:"↬",histConnectMulti:"↬",histDisconnect:"✂",histDuplicate:"⧉",histPaste:"⎘",histAlign:"▤",histDistribute:"▦",histLayer:"⬍",histAutoLayout:"⊞",histPageStyle:"▢",histConnColor:"●",histConnStyle:"⌒",histResize:"⤡",histEditText:"T",histGenerate:"✦",histRestore:"↺",histEdit:"✎"};
        const labelFor=(entry)=>{
          if(!entry)return "";
          const raw=(t as any)[entry.label]||entry.label||"";
          if(entry.item){const itemLabel=(customLabels as any)[entry.item]||(t as any)[gd(entry.item)?.labelKey]||gd(entry.item)?.label||entry.item;return raw.replace("{item}",itemLabel);}
          return raw.replace("{item}","");
        };
        const timeFor=(ts)=>{if(!ts)return "";try{return new Date(ts).toLocaleTimeString(lang==='fr'?'fr-CA':'en-US',{hour:'2-digit',minute:'2-digit'});}catch{return "";}};
        // Build the visual timeline: newest at top.
        // future (newest first) → NOW → past (newest→oldest) → initial
        const nowIdx=past.length;
        const rows=[];
        // future entries are redo-able steps ABOVE "now"
        future.forEach((f,i)=>{rows.push({kind:'future',entry:f,idx:nowIdx+future.length-i});});
        rows.push({kind:'now',idx:nowIdx});
        for(let i=past.length-1;i>=0;i--){rows.push({kind:'past',entry:past[i],idx:i});}
        return(
        <div style={{position:"fixed",bottom:"calc(16px + env(safe-area-inset-bottom, 0px))",left:sidebarW+12,zIndex:9999,userSelect:"none",animation:"fadeSlideUp .18s ease"}}>
          <style>{`@keyframes fadeSlideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes histPop{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

          {/* Timeline popover */}
          {showHistory&&(
            <div style={{position:"absolute",bottom:46,left:0,width:264,maxHeight:340,background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:12,boxShadow:"0 12px 32px rgba(15,23,42,.16)",overflow:"hidden",display:"flex",flexDirection:"column",animation:"histPop .14s ease"}}>
              <div style={{padding:"11px 14px 9px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:12.5,fontWeight:700,color:"#0F172A",letterSpacing:.2}}>{t.histTitle}</span>
                <button onClick={()=>setShowHistory(false)} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:15,lineHeight:1,padding:2}}>✕</button>
              </div>
              <div style={{overflowY:"auto",padding:"6px 0"}}>
                {rows.map((r,ri)=>{
                  const isNow=r.kind==='now';
                  const isFuture=r.kind==='future';
                  const lbl=isNow?t.histNow:labelFor(r.entry);
                  const ic=isNow?"●":(histIcon[r.entry?.label]||r.entry?.icon||"✎");
                  return(
                    <button key={ri}
                      onClick={()=>{if(!isNow){jumpRef.current?.(r.idx);}}}
                      disabled={isNow}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"7px 14px",background:isNow?"#EFF6FF":"none",border:"none",cursor:isNow?"default":"pointer",textAlign:"left",opacity:isFuture?.55:1,transition:"background .1s"}}
                      onMouseEnter={e=>{if(!isNow)e.currentTarget.style.background="#F8FAFC";}}
                      onMouseLeave={e=>{if(!isNow)e.currentTarget.style.background="none";}}
                    >
                      <span style={{width:24,height:24,flexShrink:0,borderRadius:6,background:isNow?"#2563EB":"#F1F5F9",color:isNow?"#fff":"#475569",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>{ic}</span>
                      <span style={{flex:1,minWidth:0}}>
                        <span style={{display:"block",fontSize:12.5,fontWeight:isNow?700:500,color:isNow?"#1D4ED8":"#1E293B",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{lbl}</span>
                        {!isNow&&r.entry?.ts&&<span style={{display:"block",fontSize:10.5,color:"#94A3B8",marginTop:1}}>{timeFor(r.entry.ts)}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* The pill: undo | redo | clock */}
          <div style={{display:"flex",alignItems:"center",background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:12,boxShadow:"0 4px 16px rgba(15,23,42,.12)",overflow:"hidden"}}>
            <button onClick={()=>undoRef.current?.()} disabled={!canUndo} title={`${t.histUndo} (Ctrl+Z)`}
              style={{width:38,height:38,background:"none",border:"none",color:canUndo?"#334155":"#CBD5E1",cursor:canUndo?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
              onPointerEnter={e=>{if(canUndo)e.currentTarget.style.background="#F1F5F9";}} onPointerLeave={e=>{e.currentTarget.style.background="none";}}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7.5h7.5a4 4 0 1 1 0 8H6"/><polyline points="2 4 2 7.5 5.5 7.5"/></svg>
            </button>
            <div style={{width:1,height:18,background:"#E2E8F0",flexShrink:0}}/>
            <button onClick={()=>redoRef.current?.()} disabled={!canRedo} title={`${t.histRedo} (Ctrl+Y)`}
              style={{width:38,height:38,background:"none",border:"none",color:canRedo?"#334155":"#CBD5E1",cursor:canRedo?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
              onPointerEnter={e=>{if(canRedo)e.currentTarget.style.background="#F1F5F9";}} onPointerLeave={e=>{e.currentTarget.style.background="none";}}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7.5H7.5a4 4 0 1 0 0 8H11"/><polyline points="15 4 15 7.5 11.5 7.5"/></svg>
            </button>
            <div style={{width:1,height:18,background:"#E2E8F0",flexShrink:0}}/>
            <button onClick={()=>setShowHistory(v=>!v)} title={t.histTitle}
              style={{width:38,height:38,background:showHistory?"#EFF6FF":"none",border:"none",color:showHistory?"#2563EB":"#334155",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
              onPointerEnter={e=>{if(!showHistory)e.currentTarget.style.background="#F1F5F9";}} onPointerLeave={e=>{if(!showHistory)e.currentTarget.style.background="none";}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>
            </button>
          </div>
        </div>
        );
      })()}

      {/* ── Zoom controls — position:fixed so always visible, unaffected by overflow:hidden ── */}
      {(()=>{
        const zb:React.CSSProperties={width:36,height:36,background:"none",border:"none",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0};
        const fitToScreen=()=>{
          if(!nodes.length||!cvRef.current){setPan({x:80,y:50});setZoom(0.8);return;}
          const rect=cvRef.current.getBoundingClientRect();
          const pad=64;
          let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
          nodes.forEach(n=>{const{w,h}=gs(gd(n.type),n);x0=Math.min(x0,n.x);y0=Math.min(y0,n.y);x1=Math.max(x1,n.x+w);y1=Math.max(y1,n.y+h);});
          const bw=x1-x0+pad*2,bh=y1-y0+pad*2;
          const z=Math.min(Math.max(rect.width/bw,0.15),Math.min(rect.height/bh,2));
          setPan({x:rect.width/2-(x0-pad+bw/2)*z,y:rect.height/2-(y0-pad+bh/2)*z});
          setZoom(z);
        };
        const rOffset=showRP?256:16;
        return(
          <div style={{
            position:"fixed",
            bottom:"calc(16px + env(safe-area-inset-bottom, 0px))",
            right:rOffset,
            display:"flex",alignItems:"center",
            background:"#FFFFFF",border:"1px solid #475569",
            borderRadius:12,
            boxShadow:"0 4px 24px rgba(0,0,0,.7)",
            zIndex:9999,userSelect:"none",overflow:"hidden",
          }}>
            <button onClick={()=>setZoom(z=>Math.max(0.15,+(z-.1).toFixed(2)))} style={zb}
              title="Zoom −"
              onPointerEnter={e=>(e.currentTarget.style.background="#E5E7EB")} onPointerLeave={e=>(e.currentTarget.style.background="none")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            {zoomInput===null
              ?<span onClick={()=>setZoomInput(String(Math.round(zoom*100)))}
                  style={{color:"#111827",fontSize:13,fontWeight:700,minWidth:52,textAlign:"center",cursor:"text",padding:"0 4px",lineHeight:"36px"}}>
                  {Math.round(zoom*100)}%
                </span>
              :<input autoFocus value={zoomInput}
                  onChange={e=>setZoomInput(e.target.value.replace(/[^0-9]/g,""))}
                  onBlur={()=>{const v=parseInt(zoomInput);if(!isNaN(v)&&v>=10&&v<=400)setZoom(v/100);setZoomInput(null);}}
                  onKeyDown={e=>{if(e.key==="Enter"){const v=parseInt(zoomInput);if(!isNaN(v)&&v>=10&&v<=400)setZoom(v/100);setZoomInput(null);}if(e.key==="Escape")setZoomInput(null);}}
                  style={{width:52,background:"transparent",border:"none",borderBottom:"2px solid #3B82F6",color:"#111827",padding:"0 4px",fontSize:13,fontWeight:700,textAlign:"center",outline:"none",fontFamily:"inherit"}}/>
            }
            <button onClick={()=>setZoom(z=>Math.min(4,+(z+.1).toFixed(2)))} style={zb}
              title="Zoom +"
              onPointerEnter={e=>(e.currentTarget.style.background="#E5E7EB")} onPointerLeave={e=>(e.currentTarget.style.background="none")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="3" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div style={{width:1,height:20,background:"#F3F4F6",margin:"0 1px",flexShrink:0}}/>
            <button onClick={fitToScreen} style={zb}
              title="Fit to screen"
              onPointerEnter={e=>(e.currentTarget.style.background="#E5E7EB")} onPointerLeave={e=>(e.currentTarget.style.background="none")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 5.5V2h3.5M11.5 2H15v3.5M15 10.5V14h-3.5M4.5 14H1v-3.5"/>
              </svg>
            </button>
          </div>
        );
      })()}
    </div>
  );
}
