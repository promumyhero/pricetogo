export type UnitCategory = "MASS" | "VOLUME" | "DISCRETE";

export interface UnitDefinition {
  code: string;
  label: string;
  category: UnitCategory;
  baseRatio: number; // multiplier to convert to base unit (grams for MASS, ml for VOLUME, 1 for DISCRETE)
}

export const SUPPORTED_UNITS: Record<string, UnitDefinition> = {
  KG: { code: "KG", label: "Kilogram (kg)", category: "MASS", baseRatio: 1000 },
  GRAM: { code: "GRAM", label: "Gram (gr)", category: "MASS", baseRatio: 1 },
  MG: { code: "MG", label: "Miligram (mg)", category: "MASS", baseRatio: 0.001 },
  
  LITER: { code: "LITER", label: "Liter (L)", category: "VOLUME", baseRatio: 1000 },
  ML: { code: "ML", label: "Mililiter (ml)", category: "VOLUME", baseRatio: 1 },
  
  PCS: { code: "PCS", label: "Pieces (pcs)", category: "DISCRETE", baseRatio: 1 },
  BUTIR: { code: "BUTIR", label: "Butir (btr)", category: "DISCRETE", baseRatio: 1 },
  LEMBAR: { code: "LEMBAR", label: "Lembar (lbr)", category: "DISCRETE", baseRatio: 1 },
  PORSI: { code: "PORSI", label: "Porsi", category: "DISCRETE", baseRatio: 1 },
  PACK: { code: "PACK", label: "Pack / Bungkus", category: "DISCRETE", baseRatio: 1 },
  SDM: { code: "SDM", label: "Sendok Makan (sdm ~15g)", category: "MASS", baseRatio: 15 },
  SDT: { code: "SDT", label: "Sendok Teh (sdt ~5g)", category: "MASS", baseRatio: 5 },
};

export interface IngredientInput {
  id: string;
  name: string;
  category: "BAHAN_BAKU" | "BUMBU" | "PACKAGING" | "OPERASIONAL";
  purchasePrice: number; // e.g. Rp 50.000
  purchaseQty: number;   // e.g. 1
  purchaseUnit: string;  // e.g. "KG"
  yieldPercent: number;  // e.g. 85 (meaning 15% shrinkage/waste), default 100
}

export interface RecipeItemInput {
  id: string;
  ingredientId: string;
  usageQty: number;      // e.g. 150
  usageUnit: string;     // e.g. "GRAM"
  notes?: string;
}

export interface MenuItemInput {
  id: string;
  name: string;
  category: string;
  description?: string;
  targetMarginDineIn: number;   // e.g. 65 (%)
  overheadPercent: number;      // e.g. 5 (%) buffer for gas/oil/electricity
  packagingOfflineCost: number; // e.g. Rp 500
  packagingOnlineCost: number;  // e.g. Rp 2.500 (paper bowl, seal, spoon, plastic bag)
  manualOfflinePrice?: number;  // optional override
  recipeItems: RecipeItemInput[];
}

export interface PlatformConfig {
  id: string;
  name: string;
  badgeColor: string;
  commissionPercent: number;        // e.g. 20 (%)
  fixedFee: number;                  // e.g. Rp 1.000 (GoBiz system fee)
  promoMerchantSharePercent: number; // e.g. 15 (%)
  promoPlatformSharePercent: number; // e.g. 10 (%)
  programName: string;               // e.g. "Maksimal Pro", "Mega Diskon"
}

export const DEFAULT_PLATFORMS: PlatformConfig[] = [
  {
    id: "gofood_reguler",
    name: "GoFood (Reguler)",
    badgeColor: "#00AA13",
    commissionPercent: 20,
    fixedFee: 1000,
    promoMerchantSharePercent: 0,
    promoPlatformSharePercent: 0,
    programName: "Reguler (Komisi Standar 20%)",
  },
  {
    id: "gofood_maksimal_pro",
    name: "GoFood (Maksimal Pro)",
    badgeColor: "#00AA13",
    commissionPercent: 20,
    fixedFee: 1000,
    promoMerchantSharePercent: 15,
    promoPlatformSharePercent: 10,
    programName: "Maksimal Pro (Diskon 25%, Patungan 15% Merchant)",
  },
  {
    id: "grabfood_reguler",
    name: "GrabFood (Reguler)",
    badgeColor: "#00B14F",
    commissionPercent: 20,
    fixedFee: 0,
    promoMerchantSharePercent: 0,
    promoPlatformSharePercent: 0,
    programName: "Reguler (Komisi Standar 20%)",
  },
  {
    id: "grabfood_mega_diskon",
    name: "GrabFood (Mega Diskon)",
    badgeColor: "#00B14F",
    commissionPercent: 20,
    fixedFee: 0,
    promoMerchantSharePercent: 20,
    promoPlatformSharePercent: 10,
    programName: "Mega Diskon (Diskon 30%, Beban Merchant 20%)",
  },
  {
    id: "shopeefood_reguler",
    name: "ShopeeFood (Reguler)",
    badgeColor: "#EE4D2D",
    commissionPercent: 20,
    fixedFee: 0,
    promoMerchantSharePercent: 0,
    promoPlatformSharePercent: 0,
    programName: "Reguler (Komisi Standar 20%)",
  },
];

/**
 * Calculates the exact cost of using an ingredient in a recipe
 */
export function calculateItemCost(
  ingredient: IngredientInput,
  usageQty: number,
  usageUnit: string
): { cost: number; error?: string } {
  const pUnit = SUPPORTED_UNITS[ingredient.purchaseUnit];
  const uUnit = SUPPORTED_UNITS[usageUnit];

  if (!pUnit || !uUnit) {
    return { cost: 0, error: "Satuan unit tidak valid" };
  }

  // Cross category check (cannot convert volume to mass without density)
  if (pUnit.category !== uUnit.category) {
    // If discrete and mass/volume, fallback direct proportion if units match
    if (ingredient.purchaseUnit !== usageUnit) {
      return { cost: 0, error: `Tidak bisa konversi satuan ${pUnit.category} ke ${uUnit.category}` };
    }
  }

  // Calculate yield factor (shrinkage)
  const yieldRatio = Math.max(0.01, (ingredient.yieldPercent || 100) / 100);

  // Total base units bought (e.g. 1 kg = 1000 grams)
  const totalBaseUnitsPurchased = ingredient.purchaseQty * pUnit.baseRatio;
  
  // Usable base units after shrinkage (e.g. 1000g * 0.85 = 850g)
  const usableBaseUnits = totalBaseUnitsPurchased * yieldRatio;

  if (usableBaseUnits <= 0) return { cost: 0, error: "Jumlah pembelian tidak valid" };

  // Cost per base unit (e.g. Rp per gram)
  const costPerBaseUnit = ingredient.purchasePrice / usableBaseUnits;

  // Recipe usage in base units
  const usageInBaseUnits = usageQty * uUnit.baseRatio;

  const cost = usageInBaseUnits * costPerBaseUnit;

  return { cost };
}

/**
 * Costing Breakdown Result for a Menu Item
 */
export interface MenuCostingBreakdown {
  rawFoodCost: number;          // Total bahan baku
  overheadBufferCost: number;   // Alokasi gas/bumbu/listrik
  cogsDineIn: number;           // HPP Makan di Tempat (Bahan + Overhead + Kemasan Dine-In)
  cogsOnline: number;           // HPP Online (Bahan + Overhead + Kemasan Online)
  suggestedDineInPrice: number; // Harga jual offline rekomendasi
  finalDineInPrice: number;     // Harga offline final (manual or suggested)
  dineInGrossProfit: number;    // Keuntungan kotor offline (Rp)
  dineInGrossMargin: number;    // Gross margin offline (%)
  dineInFoodCostPercent: number;// Food cost ratio offline (%)
  itemBreakdowns: {
    ingredientId: string;
    ingredientName: string;
    usageText: string;
    cost: number;
    costPercentage: number;
  }[];
}

/**
 * Computes full HPP & Dine-in pricing for a menu item
 */
export function calculateMenuCosting(
  menu: MenuItemInput,
  ingredientMap: Map<string, IngredientInput>
): MenuCostingBreakdown {
  let rawFoodCost = 0;
  const itemBreakdowns: MenuCostingBreakdown["itemBreakdowns"] = [];

  for (const item of menu.recipeItems) {
    const ing = ingredientMap.get(item.ingredientId);
    if (!ing) continue;

    const { cost } = calculateItemCost(ing, item.usageQty, item.usageUnit);
    rawFoodCost += cost;

    itemBreakdowns.push({
      ingredientId: ing.id,
      ingredientName: ing.name,
      usageText: `${item.usageQty} ${SUPPORTED_UNITS[item.usageUnit]?.label || item.usageUnit}`,
      cost,
      costPercentage: 0, // will compute after total
    });
  }

  // Compute percentages
  for (const b of itemBreakdowns) {
    b.costPercentage = rawFoodCost > 0 ? (b.cost / rawFoodCost) * 100 : 0;
  }

  // Overhead buffer (e.g. 5% of raw food cost)
  const overheadBufferCost = rawFoodCost * ((menu.overheadPercent || 0) / 100);

  // Total HPP Dine-In
  const cogsDineIn = rawFoodCost + overheadBufferCost + (menu.packagingOfflineCost || 0);

  // Total HPP Online
  const cogsOnline = rawFoodCost + overheadBufferCost + (menu.packagingOnlineCost || 0);

  // Suggested Dine-In Price based on Target Gross Margin
  // Formula: Price = COGS / (1 - Target Margin %)
  const targetMarginRatio = Math.min(0.95, Math.max(0.05, (menu.targetMarginDineIn || 65) / 100));
  const rawSuggestedPrice = cogsDineIn / (1 - targetMarginRatio);
  
  // Clean rounding to nearest Rp 500
  const suggestedDineInPrice = Math.ceil(rawSuggestedPrice / 500) * 500;

  // Final offline price
  const finalDineInPrice = menu.manualOfflinePrice && menu.manualOfflinePrice > 0
    ? menu.manualOfflinePrice
    : suggestedDineInPrice;

  const dineInGrossProfit = finalDineInPrice - cogsDineIn;
  const dineInGrossMargin = finalDineInPrice > 0 ? (dineInGrossProfit / finalDineInPrice) * 100 : 0;
  const dineInFoodCostPercent = finalDineInPrice > 0 ? (cogsDineIn / finalDineInPrice) * 100 : 0;

  return {
    rawFoodCost,
    overheadBufferCost,
    cogsDineIn,
    cogsOnline,
    suggestedDineInPrice,
    finalDineInPrice,
    dineInGrossProfit,
    dineInGrossMargin,
    dineInFoodCostPercent,
    itemBreakdowns,
  };
}

/**
 * Reverse Pricing Calculation for Online Delivery (GoFood / GrabFood)
 */
export interface OnlinePricingResult {
  platformId: string;
  platformName: string;
  badgeColor: string;
  programName: string;
  
  // Target Net Cash Merchant wants to receive
  targetNetPayout: number;

  // The final listing price to enter into GoBiz / GrabMerchant
  recommendedListingPrice: number;

  // Customer experience
  totalDiscountPercent: number; // e.g. 25%
  customerPays: number;         // what customer actually pays

  // Financial Waterfall & Deductions
  merchantPromoDeduction: number;   // rupiah deduction funded by merchant
  platformPromoSubsidy: number;     // rupiah subsidy funded by platform
  platformCommissionFee: number;    // rupiah taken by Gojek/Grab
  fixedFee: number;                 // rupiah system fee
  totalDeductions: number;          // total cuts from listing price

  // Merchant Net Realization
  netPayoutToMerchant: number;      // cash entering merchant bank account
  cogsOnline: number;               // total HPP Online
  netProfit: number;                // Net profit after all costs (payout - cogsOnline)
  netProfitMargin: number;          // Net profit margin % (netProfit / netPayoutToMerchant)
  
  // Comparison vs Dine-in
  profitVsDineInDifference: number; // selisih profit dibandingkan dine-in
  isProfitable: boolean;
  statusLabel: "OPTIMAL" | "TIGHT" | "RISK";
}

/**
 * Industry Reverse Pricing Formula:
 * Payout = ListingPrice * (1 - PromoMerchantShare% - Commission%) - FixedFee
 *
 * To guarantee Payout >= TargetNetPayout:
 * ListingPrice = (TargetNetPayout + FixedFee) / (1 - (Commission% + PromoMerchantShare%))
 */
export function calculateOnlinePricing(
  costing: MenuCostingBreakdown,
  platform: PlatformConfig
): OnlinePricingResult {
  // Target Net Payout is Dine-in selling price + extra online packaging
  const extraPackaging = Math.max(0, costing.cogsOnline - costing.cogsDineIn);
  const targetNetPayout = costing.finalDineInPrice + extraPackaging;

  const commissionRate = (platform.commissionPercent || 0) / 100;
  const merchantPromoRate = (platform.promoMerchantSharePercent || 0) / 100;
  const platformPromoRate = (platform.promoPlatformSharePercent || 0) / 100;
  const totalPromoRate = merchantPromoRate + platformPromoRate;

  // Combined merchant deduction rate
  const totalDeductionRate = commissionRate + merchantPromoRate;

  let rawListingPrice = targetNetPayout;
  if (totalDeductionRate < 0.95) {
    rawListingPrice = (targetNetPayout + (platform.fixedFee || 0)) / (1 - totalDeductionRate);
  } else {
    // Edge case safety
    rawListingPrice = (targetNetPayout + (platform.fixedFee || 0)) / 0.05;
  }

  // Round up to nearest Rp 1.000 for standard Indonesian menu pricing
  const recommendedListingPrice = Math.ceil(rawListingPrice / 1000) * 1000;

  // Calculate actual waterfall based on recommendedListingPrice
  const customerPays = recommendedListingPrice * (1 - totalPromoRate);
  const merchantPromoDeduction = recommendedListingPrice * merchantPromoRate;
  const platformPromoSubsidy = recommendedListingPrice * platformPromoRate;
  
  // Platform takes commission on listing price (or after platform promo)
  const platformCommissionFee = recommendedListingPrice * commissionRate;
  const fixedFee = platform.fixedFee || 0;

  const totalDeductions = merchantPromoDeduction + platformCommissionFee + fixedFee;
  const netPayoutToMerchant = recommendedListingPrice - totalDeductions;

  const netProfit = netPayoutToMerchant - costing.cogsOnline;
  const netProfitMargin = netPayoutToMerchant > 0 ? (netProfit / netPayoutToMerchant) * 100 : 0;

  const profitVsDineInDifference = netProfit - costing.dineInGrossProfit;
  const isProfitable = netProfit > 0;

  let statusLabel: "OPTIMAL" | "TIGHT" | "RISK" = "OPTIMAL";
  if (!isProfitable || netProfitMargin < 15) {
    statusLabel = "RISK";
  } else if (netProfitMargin < 35) {
    statusLabel = "TIGHT";
  }

  return {
    platformId: platform.id,
    platformName: platform.name,
    badgeColor: platform.badgeColor,
    programName: platform.programName,
    targetNetPayout,
    recommendedListingPrice,
    totalDiscountPercent: totalPromoRate * 100,
    customerPays,
    merchantPromoDeduction,
    platformPromoSubsidy,
    platformCommissionFee,
    fixedFee,
    totalDeductions,
    netPayoutToMerchant,
    cogsOnline: costing.cogsOnline,
    netProfit,
    netProfitMargin,
    profitVsDineInDifference,
    isProfitable,
    statusLabel,
  };
}
