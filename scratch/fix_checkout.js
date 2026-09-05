const fs = require('fs');
let code = fs.readFileSync('src/app/checkout/page.tsx', 'utf-8');

// Colors & Layout
code = code.replace(/bg-neutral-900\/[0-9]{2}/g, 'bg-[#0a0a0a]');
code = code.replace(/border-white\/10/g, 'border-neutral-800');
code = code.replace(/rounded-(3xl|2xl|xl)/g, 'rounded-none');
code = code.replace(/bg-neutral-800\/80/g, 'bg-neutral-950');
code = code.replace(/bg-neutral-800\/40/g, 'bg-neutral-950');
code = code.replace(/bg-neutral-800\/60/g, 'bg-neutral-950');
code = code.replace(/bg-white\/5/g, 'bg-neutral-950');
code = code.replace(/bg-white\/10/g, 'bg-neutral-950 hover:bg-neutral-900');
code = code.replace(/backdrop-blur-xl/g, '');
code = code.replace(/border-primary\/20/g, 'border-neutral-800');
code = code.replace(/pt-28 pb-24/g, 'pt-4 pb-4');
code = code.replace(/pt-24 pb-24/g, 'pt-12 pb-16');

// Corner brackets to inject
const cornerBrackets = `
                  <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-neutral-600 !m-0"></div>
                  <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-neutral-600 !m-0"></div>
                  <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-neutral-600 !m-0"></div>
                  <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-neutral-600 !m-0"></div>`;

// Add brackets right before the closing div of space-y-6 containers
// Note: we can't easily parse HTML with regex, so we'll just insert it at specific known spots
code = code.replace(/<div className="bg-\[#0a0a0a\] border border-neutral-800 rounded-none p-8 space-y-6">/g, '<div className="bg-[#0a0a0a] border border-neutral-800 rounded-none p-8 space-y-6 relative">');
code = code.replace(/<div className="bg-\[#0a0a0a\] border border-neutral-800 rounded-none p-8 sticky top-28 space-y-6">/g, '<div className="bg-[#0a0a0a] border border-neutral-800 rounded-none p-8 sticky top-28 space-y-6 relative">');

code = code.replace(/<\/div>\n\n                \{\/\* Payment Selection Box \*\/\}/, cornerBrackets + '\n                </div>\n\n                {/* Payment Selection Box */}');
code = code.replace(/<\/div>\n\n                \{error && \(/, cornerBrackets + '\n                </div>\n\n                {error && (');
code = code.replace(/<\/div>\n              <\/div>\n            <\/div>\n          <\/div>/, cornerBrackets + '\n              </div>\n            </div>\n          </div>\n          </div>');

// Empty cart brackets
code = code.replace(/<div className="py-20 text-center space-y-6 bg-\[#0a0a0a\] border border-neutral-800 rounded-none">/g, '<div className="py-20 text-center space-y-6 bg-[#0a0a0a] border border-neutral-800 rounded-none relative">');
code = code.replace(/<\/Link>\n          <\/div>\n        \) : \(/, '</Link>' + cornerBrackets + '\n          </div>\n        ) : (');

// Terminology
code = code.replace(/Order Confirmed/g, 'ORDER COMPLETE');
code = code.replace(/Thank You!/g, 'Thank You');
code = code.replace(/Back to Home/g, 'BACK TO HOME');
code = code.replace(/Continue Shopping/g, 'CONTINUE SHOPPING');
code = code.replace(/Return to Shop/g, 'RETURN TO SHOP');
code = code.replace(/Your Cart is Empty/g, 'Cart Empty');
code = code.replace(/Please add items to your cart before proceeding to checkout./g, 'Your cart is currently empty. Please add items to proceed.');
code = code.replace(/Explore Store/g, 'RETURN TO SHOP');
code = code.replace(/Delivery Information/g, 'DELIVERY INFORMATION');
code = code.replace(/Payment Method/g, 'PAYMENT METHOD');
code = code.replace(/Summary \(\{items.length\} items\)/g, 'ORDER SUMMARY ({items.length})');
code = code.replace(/<main className="min-h-screen bg-black text-white pt-12 pb-16">/g, '<main className="min-h-screen bg-black text-white pt-12 pb-16 font-mono">');

fs.writeFileSync('src/app/checkout/page.tsx', code);
console.log('Fixed checkout page styling');
