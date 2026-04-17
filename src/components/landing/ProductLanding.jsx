import React, { useState, useEffect } from 'react';
import CategoryCard from '../layout/CategoryCard';
import Badge from '../common/Badge';
import { useAnalytics } from '../../hooks/useAnalytics';
import ScoreGauge from '../common/ScoreGauge';

export default function ProductLanding({ product }) {
  const { topLayer, sotspor, naeringarefni, hreinleiki } = product;
  const [activeCategory, setActiveCategory] = useState(null);
  const { trackLanding, trackCategoryOpen } = useAnalytics(product.id);

  useEffect(() => {
    trackLanding();
  }, [trackLanding]);

  const handleCategoryClick = (category) => {
    trackCategoryOpen(category);
    setActiveCategory(activeCategory === category ? null : category);
  };

  const sustainabilityColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-48 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-2">🐟</div>
            <p className="text-blue-200 text-sm">{product.format === 'frozen' ? '❄️ Frozen' : '🧊 Fresh'} · {product.cut === 'whole_gutted' ? 'Whole' : 'Loin'}</p>
          </div>
        </div>

        <div className="p-5">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500 mt-1">
            {product.species.common_name} · {topLayer.origin_short}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            <span className="italic">{product.species.scientific_name}</span>
            {' · '}{topLayer.catch_method}
          </p>

          {/* Score Gauges */}
<div className="flex justify-around items-start mt-5">
  <ScoreGauge
    value={topLayer.sustainability_score}
    max={100}
    label="Sustainability"
  />
  <ScoreGauge
    value={topLayer.purity_score}
    max={100}
    label="Purity"
  />
  <ScoreGauge
    value={product.saga.days_from_catch_to_shelf}
    max={20}
    label="Days to Shelf"
    color="#2563eb"
  />
</div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {topLayer.certifications.map((cert) => (
              <Badge key={cert} type={cert} />
            ))}
          </div>
        </div>
      </div>

      {/* Category Cards — TAP 1 */}
      <div className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide px-1">
          Explore
        </h2>

        <CategoryCard
          icon="📜"
          title="Product Story"
          subtitle={`Caught ${product.saga.catch_date} · ${product.saga.vessel_name}`}
          onClick={() => handleCategoryClick('saga')}
        />

        <CategoryCard
          icon="🌍"
          title="Footprint"
          subtitle={`${sotspor.carbon_kg_co2_per_kg} kg CO₂/kg · ${sotspor.transport_km} km`}
          onClick={() => handleCategoryClick('sotspor')}
        />

        <CategoryCard
          icon="🥗"
          title="Nutrition"
          subtitle={`${naeringarefni.per_100g.protein_g}g protein · ${naeringarefni.per_100g.omega3_epa_mg + naeringarefni.per_100g.omega3_dha_mg}mg Omega-3`}
          onClick={() => handleCategoryClick('naeringarefni')}
        />

        <CategoryCard
          icon="🔬"
          title="Purity"
          subtitle={hreinleiki.all_eu_limits_passed ? '✅ All EU limits passed' : '⚠️ Review results'}
          onClick={() => handleCategoryClick('hreinleiki')}
        />

        <CategoryCard
          icon="📦"
          title="More Info"
          subtitle={`${product.extra.storage_instructions.split('.')[0]}`}
          onClick={() => handleCategoryClick('extra')}
        />
      </div>

      {/* Active Category Detail — TAP 1 expanded */}
      {activeCategory && (
        <CategoryDetail
          category={activeCategory}
          product={product}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
}

function CategoryDetail({ category, product, onClose }) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  let title = '';
  let content = null;

  switch (category) {
    case 'saga':
      title = '📖 Product Story';
      content = <SagaDetail saga={product.saga} />;
      break;
    case 'sotspor':
      title = '🌍 Footprint';
      content = <SotsporDetail sotspor={product.sotspor} />;
      break;
    case 'naeringarefni':
      title = '🥗 Nutrition';
      content = <NaeringarefniDetail naeringarefni={product.naeringarefni} />;
      break;
    case 'hreinleiki':
      title = '🔬 Purity';
      content = <HreinleikiDetail hreinleiki={product.hreinleiki} />;
      break;
    case 'extra':
      title = 'ℹ️ More Info';
      content = <ExtraDetail extra={product.extra} />;
      break;
    default:
      title = 'Details';
      content = <p>No details available.</p>;
  }

  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Bottom sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl animate-slide-up"
        style={{ maxHeight: '85vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-4 pt-4 pb-8" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {content}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   CATEGORY DETAIL COMPONENTS
   ============================================ */

function SagaDetail({ saga }) {
  return (
    <div className="space-y-6">
      {/* Quick Facts */}
      <div className="grid grid-cols-2 gap-3">
        <InfoBox label="Catch Area" value={saga.catch_area} />
        <InfoBox label="Method" value={saga.catch_method} />
        <InfoBox label="Vessel" value={saga.vessel_name} />
        <InfoBox label="Landed" value={saga.landing_port} />
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Journey</h3>
        <div className="space-y-0">
          {saga.supply_chain.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5" />
                {i < saga.supply_chain.length - 1 && (
                  <div className="w-0.5 bg-blue-200 flex-1 min-h-[40px]" />
                )}
              </div>
              <div className="pb-4">
                <p className="font-medium text-gray-900">{step.step}</p>
                <p className="text-sm text-gray-500">{step.location}</p>
                <p className="text-xs text-gray-400">{step.date} · {step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-1">Processing</h3>
        <p className="text-sm text-blue-800">{saga.processing_method}</p>
        <p className="text-xs text-blue-600 mt-1">{saga.processing_facility}</p>
      </div>
    </div>
  );
}

function SotsporDetail({ sotspor }) {
  const maxCarbon = Math.max(
    sotspor.carbon_kg_co2_per_kg,
    sotspor.comparison.beef_carbon
  );

  return (
    <div className="space-y-6">
      {/* Main carbon number */}
      <div className="text-center bg-green-50 rounded-xl p-5">
        <div className="text-4xl font-bold text-green-700">
          {sotspor.carbon_kg_co2_per_kg}
        </div>
        <div className="text-sm text-green-600 mt-1">kg CO₂ per kg of product</div>
      </div>

      {/* Comparison bars */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Compared to</h3>
        <div className="space-y-3">
          <ComparisonRow
            label="This product"
            value={sotspor.carbon_kg_co2_per_kg}
            max={maxCarbon}
            color="bg-green-500"
          />
          <ComparisonRow
            label="Avg whitefish"
            value={sotspor.comparison.category_avg_whitefish_carbon}
            max={maxCarbon}
            color="bg-blue-400"
          />
          <ComparisonRow
            label="Chicken"
            value={sotspor.comparison.chicken_carbon}
            max={maxCarbon}
            color="bg-yellow-400"
          />
          <ComparisonRow
            label="Beef"
            value={sotspor.comparison.beef_carbon}
            max={maxCarbon}
            color="bg-red-400"
          />
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Breakdown</h3>
        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="Fishing fuel" value={`${sotspor.fishing_fuel_liters_per_kg} L/kg`} />
          <InfoBox label="Processing" value={`${sotspor.processing_energy_kwh_per_kg} kWh/kg`} />
          <InfoBox label="Transport" value={`${sotspor.transport_km} km`} />
          <InfoBox label="Transport mode" value={sotspor.transport_mode} />
          <InfoBox label="Cold chain" value={`${sotspor.cold_chain_energy_kwh_per_kg} kWh/kg`} />
          <InfoBox label="Water use" value={`${sotspor.water_liters_per_kg} L/kg`} />
          <InfoBox label="Waste" value={`${sotspor.waste_percentage}%`} />
          <InfoBox label="Packaging" value={sotspor.packaging_recyclable ? '♻️ Recyclable' : 'Not recyclable'} />
        </div>
      </div>

      {/* Note */}
      {sotspor.notes && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">{sotspor.notes}</p>
        </div>
      )}
    </div>
  );
}

function NaeringarefniDetail({ naeringarefni }) {
  const n = naeringarefni.per_100g;
  const v = naeringarefni.vitamins_minerals;

  return (
    <div className="space-y-6">
      {/* Health highlights */}
      <div className="flex flex-wrap gap-2">
        {naeringarefni.health_highlights.map((h) => (
          <span
            key={h}
            className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Nutrition table */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Per 100g</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <NutritionRow label="Energy" value={`${n.energy_kcal} kcal / ${n.energy_kj} kJ`} bold />
          <NutritionRow label="Protein" value={`${n.protein_g} g`} />
          <NutritionRow label="Total Fat" value={`${n.fat_total_g} g`} />
          <NutritionRow label="  Saturated" value={`${n.fat_saturated_g} g`} indent />
          <NutritionRow label="  Polyunsaturated" value={`${n.fat_polyunsaturated_g} g`} indent />
          <NutritionRow label="  Omega-3 EPA" value={`${n.omega3_epa_mg} mg`} indent highlight />
          <NutritionRow label="  Omega-3 DHA" value={`${n.omega3_dha_mg} mg`} indent highlight />
          <NutritionRow label="Carbohydrates" value={`${n.carbohydrates_g} g`} />
          <NutritionRow label="Salt" value={`${n.salt_g} g`} />
        </div>
      </div>

      {/* Vitamins & Minerals */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Vitamins & Minerals</h3>
        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="Vitamin D" value={`${v.vitamin_d_ug} µg`} />
          <InfoBox label="Vitamin B12" value={`${v.vitamin_b12_ug} µg`} />
          <InfoBox label="Selenium" value={`${v.selenium_ug} µg`} />
          <InfoBox label="Iodine" value={`${v.iodine_ug} µg`} />
          <InfoBox label="Phosphorus" value={`${v.phosphorus_mg} mg`} />
          <InfoBox label="Potassium" value={`${v.potassium_mg} mg`} />
        </div>
      </div>
    </div>
  );
}

function HreinleikiDetail({ hreinleiki }) {
  const hm = hreinleiki.heavy_metals;

  return (
    <div className="space-y-6">
      {/* Overall status */}
      <div className={`text-center rounded-xl p-5 ${hreinleiki.all_eu_limits_passed ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="text-4xl mb-2">
          {hreinleiki.all_eu_limits_passed ? '✅' : '⚠️'}
        </div>
        <div className={`font-bold ${hreinleiki.all_eu_limits_passed ? 'text-green-700' : 'text-red-700'}`}>
          {hreinleiki.all_eu_limits_passed ? 'All EU Limits Passed' : 'Review Required'}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Tested by {hreinleiki.testing_lab} · {hreinleiki.testing_date}
        </div>
      </div>

      {/* Quick checks */}
      <div className="grid grid-cols-2 gap-3">
        <StatusBox label="Antibiotics" passed={!hreinleiki.antibiotics_used} />
        <StatusBox label="Hormones" passed={!hreinleiki.hormones_used} />
        <StatusBox label="Pesticides" passed={!hreinleiki.pesticides_detected} />
        <StatusBox label="Microplastics" passed={hreinleiki.microplastics_result === 'Below detection limit'} />
      </div>

      {/* Heavy metals detail */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Heavy Metals</h3>
        <div className="space-y-3">
          <MetalBar label="Mercury" value={hm.mercury_mg_kg} limit={hm.mercury_eu_limit} />
          <MetalBar label="Cadmium" value={hm.cadmium_mg_kg} limit={hm.cadmium_eu_limit} />
          <MetalBar label="Lead" value={hm.lead_mg_kg} limit={hm.lead_eu_limit} />
        </div>
      </div>

      {/* Contaminants */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Contaminants</h3>
        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="PCBs" value={`${hreinleiki.contaminants.pcbs_pg_g} pg/g`} />
          <InfoBox label="Dioxins" value={`${hreinleiki.contaminants.dioxins_pg_g} / ${hreinleiki.contaminants.dioxins_eu_limit_pg_g} pg/g`} />
        </div>
      </div>

      {/* Water quality */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Water Quality</h3>
        <p className="text-sm text-blue-800">{hreinleiki.water_quality.source}</p>
        <p className="text-sm text-blue-700">{hreinleiki.water_quality.temperature_c}°C · {hreinleiki.water_quality.classification}</p>
      </div>
    </div>
  );
}

function ExtraDetail({ extra }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <InfoBox label="Storage" value={extra.storage_instructions} />
        <InfoBox label="Shelf Life" value={`${extra.shelf_life_days} days`} />
        <InfoBox label="Best Before" value={extra.best_before} />
        <InfoBox label="Batch" value={extra.batch_id} />
        <InfoBox label="Barcode" value={extra.barcode} />
        <InfoBox label="Allergens" value={extra.allergens.join(', ')} />
      </div>

      {extra.recipes && extra.recipes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Recipes</h3>
          <div className="space-y-2">
            {extra.recipes.map((recipe) => (
              <div
                key={recipe.name}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl"
              >
                <span className="text-2xl">👨‍🍳</span>
                <span className="text-sm font-medium text-orange-900">
                  {recipe.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================
   SHARED UI COMPONENTS
   ============================================ */

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900 mt-0.5">{value}</div>
    </div>
  );
}

function StatusBox({ label, passed }) {
  return (
    <div className={`rounded-lg p-3 text-center ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="text-lg">{passed ? '✅' : '❌'}</div>
      <div className={`text-xs font-medium mt-1 ${passed ? 'text-green-700' : 'text-red-700'}`}>
        {passed ? `No ${label}` : `${label} detected`}
      </div>
    </div>
  );
}

function ComparisonRow({ label, value, max, color }) {
  const width = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value} kg CO₂</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function NutritionRow({ label, value, bold, indent, highlight }) {
  return (
    <div
      className={`flex justify-between px-4 py-2 border-b border-gray-50 ${bold ? 'font-semibold' : ''} ${highlight ? 'bg-blue-50' : ''}`}
    >
      <span className={`text-sm ${indent ? 'text-gray-500 pl-3' : 'text-gray-700'}`}>
        {label}
      </span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

function MetalBar({ label, value, limit }) {
  const percentage = (value / limit) * 100;

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {value} / {limit} mg/kg
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${percentage < 30 ? 'bg-green-500' : percentage < 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {percentage.toFixed(1)}% of EU limit
      </div>
    </div>
  );
}