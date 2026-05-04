import React, { useState, useEffect } from 'react';
import CategoryCard from '../layout/CategoryCard';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Link } from 'react-router-dom';
import safetyData from '../../data/safety.json';

/* ============================================
   CERTIFICATION LOGO MAP
   ============================================ */
const CERT_LOGOS = {
  msc: {
    src: '/images/certs/msc.png',
    alt: 'MSC Certified — Sustainable wild-caught fishery',
    label: 'MSC',
  },
  asc: {
    src: '/images/certs/asc.jpg',
    alt: 'ASC Certified — Responsible aquaculture',
    label: 'ASC',
  },
  keyhole: {
    src: '/images/certs/keyhole.png',
    alt: 'Nordic Keyhole — Healthier choice',
    label: 'Keyhole',
  },
};

export default function ProductLanding({ product, batch = null }) {
  const { topLayer, naeringarefni } = product;
  const [activeCategory, setActiveCategory] = useState(null);
  const { trackLanding, trackCategoryOpen, trackDetailView } = useAnalytics(product.id);

  // Check if this is a batch-traced product
  const isTraced = batch !== null;

  useEffect(() => {
    trackLanding();
  }, [trackLanding]);

  const handleCategoryClick = (category) => {
    trackCategoryOpen(category);
    setActiveCategory(activeCategory === category ? null : category);
  };

  // For batches: use batch data only. For products: use product data.
  const displayData = isTraced
    ? {
        vessel: batch.saga?.vessel || null,
        catchDate: batch.saga?.landingDate || batch.landing_date || null,
        catchArea: batch.saga?.catchArea || batch.catch_area || null,
        catchMethod: batch.saga?.catchMethod || batch.catch_method || null,
        landingPort: batch.saga?.landingSite || batch.landing_site || null,
        processingFacility: batch.saga?.processingFacility || batch.processing_facility || null,
        processingDate: batch.saga?.processingDate || batch.processing_date || null,
        carbonPerKg: batch.carbon_per_kg_mass,
        stages: batch.stages,
      }
    : {
        vessel: product.saga?.vessel_name || null,
        catchDate: product.saga?.catch_date || null,
        catchArea: product.saga?.catch_area || null,
        catchMethod: product.saga?.catch_method || topLayer?.catch_method || null,
        landingPort: product.saga?.landing_port || null,
        processingFacility: product.saga?.processing_facility || null,
        processingDate: null,
        carbonPerKg: product.sotspor?.carbon_kg_co2_per_kg || null,
        stages: null,
      };

  // Subtitle for Product Story card
  const storySubtitle = isTraced
    ? displayData.catchDate && displayData.vessel
      ? `Caught ${displayData.catchDate} · ${displayData.vessel}`
      : displayData.catchDate
      ? `Caught ${displayData.catchDate}`
      : displayData.vessel
      ? `Vessel: ${displayData.vessel}`
      : 'View traceability details'
    : product.saga?.catch_date && product.saga?.vessel_name
    ? `Caught ${product.saga.catch_date} · ${product.saga.vessel_name}`
    : 'View product journey';

  // Subtitle for Footprint card
  const footprintSubtitle = isTraced
    ? displayData.carbonPerKg
      ? `${displayData.carbonPerKg.toFixed(2)} kg CO₂/kg ✓`
      : 'View carbon data'
    : product.sotspor
    ? `${product.sotspor.carbon_kg_co2_per_kg} kg CO₂/kg · ${product.sotspor.transport_km} km`
    : 'View footprint data';

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-48 flex items-center justify-center relative">
          {/* Traced Badge */}
          {isTraced && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <span>✓</span> Batch Verified
            </div>
          )}
          
          <div className="text-center text-white">
            <div className="text-6xl mb-2">🐟</div>
            <p className="text-blue-200 text-sm">
              {product.format === 'frozen' ? '❄️ Frozen' : '🧊 Fresh'} ·{' '}
              {product.cut === 'whole_gutted' ? 'Whole' : 'Loin'}
            </p>
          </div>
        </div>

        <div className="p-5">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500 mt-1">
            {product.species.common_name} · {product.producer?.name || topLayer?.origin_short}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            <span className="italic">{product.species.scientific_name}</span>
            {displayData.catchMethod && ` · ${displayData.catchMethod}`}
          </p>

          {/* Batch ID if traced */}
          {isTraced && (
            <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              <span>📦</span>
              <span>Batch: {batch.id}</span>
            </div>
          )}

          {/* Certifications + Days to Shelf */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <CertificationBadges certifications={product.certifications} />

            {!isTraced && product.saga?.days_from_catch_to_shelf != null && (
              <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl w-[90px] h-[90px]">
                <span className="text-3xl font-bold text-blue-700 leading-none">
                  {product.saga.days_from_catch_to_shelf}
                </span>
                <span className="text-[13px] text-blue-500 font-medium leading-tight text-center mt-1">
                  days catch
                  <br />
                  to shelf
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

{/* Batch Carbon Footprint Card - Only shown for traced products */}
{isTraced && displayData.carbonPerKg && (
  <div className="px-4 pt-4">
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span>🌍</span>
        <span className="font-semibold text-sm">Verified Carbon Footprint</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{displayData.carbonPerKg.toFixed(2)}</span>
        <span className="text-emerald-100 text-sm">kg CO₂e per kg</span>
      </div>
      {displayData.stages && (() => {
        const total = (displayData.stages.fishing || 0) + 
                      (displayData.stages.processing || 0) + 
                      (displayData.stages.distribution || 0);
        if (total === 0) return null;
        const fishingPct = Math.round((displayData.stages.fishing || 0) / total * 100);
        const processingPct = Math.round((displayData.stages.processing || 0) / total * 100);
        const distributionPct = Math.round((displayData.stages.distribution || 0) / total * 100);
        
        return (
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span>🚢</span>
              <span className="font-bold">{fishingPct}%</span>
            </div>
            <span className="text-emerald-300">·</span>
            <div className="flex items-center gap-1">
              <span>🏭</span>
              <span className="font-bold">{processingPct}%</span>
            </div>
            <span className="text-emerald-300">·</span>
            <div className="flex items-center gap-1">
              <span>🚚</span>
              <span className="font-bold">{distributionPct}%</span>
            </div>
          </div>
        );
      })()}
    </div>
  </div>
)}

      {/* Category Cards */}
      <div className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide px-1">
          Explore
        </h2>

        <CategoryCard
          icon="📜"
          title="Product Story"
          subtitle={storySubtitle}
          onClick={() => handleCategoryClick('saga')}
        />

        <CategoryCard
          icon="🥗"
          title="Nutrition"
          subtitle={`${naeringarefni.per_100g.protein_g} g protein · ${naeringarefni.per_100g.omega3_epa_mg + naeringarefni.per_100g.omega3_dha_mg} mg Omega-3`}
          onClick={() => handleCategoryClick('naeringarefni')}
        />

        <CategoryCard
          icon="🌍"
          title="Footprint"
          subtitle={footprintSubtitle}
          onClick={() => handleCategoryClick('sotspor')}
        />

        <CategoryCard
          icon="🛡️"
          title="Safety"
          subtitle="Standards & testing criteria"
          onClick={() => handleCategoryClick('safety')}
        />

        <CategoryCard
          icon="📦"
          title="More Info"
          subtitle={`${product.extra.storage_instructions.split('.')[0]}`}
          onClick={() => handleCategoryClick('extra')}
        />
      </div>

      {/* Active Category Detail */}
      {activeCategory && (
        <CategoryDetail
          category={activeCategory}
          product={product}
          batch={batch}
          displayData={displayData}
          isTraced={isTraced}
          onClose={() => setActiveCategory(null)}
          trackDetailView={trackDetailView}
        />
      )}
    </div>
  );
}

/* ============================================
   CERTIFICATION BADGES COMPONENT
   ============================================ */

function CertificationBadges({ certifications }) {
  const [activeTip, setActiveTip] = useState(null);

  if (!certifications || certifications.length === 0) return null;

  const handleTap = (certId) => {
    setActiveTip(activeTip === certId ? null : certId);
  };

  return (
    <div className="flex items-center gap-4">
      {certifications.map((cert) => {
        const logo = CERT_LOGOS[cert.id];
        if (!logo) return null;

        const isActive = activeTip === cert.id;

        return (
          <div key={cert.id} className="relative flex flex-col items-center">
            <button
              onClick={() => handleTap(cert.id)}
              className="flex items-center justify-center w-[90px] h-[90px] bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md active:bg-gray-50 transition-all focus:outline-none"
              aria-label={logo.alt}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-1 rounded">
                {logo.label}
              </span>
            </button>

            {isActive && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-20
                            bg-gray-900 text-white text-xs rounded-lg px-3 py-2
                            whitespace-nowrap shadow-lg animate-fade-in">
                <div className="font-semibold">{cert.name}</div>
                <div className="text-gray-300 mt-0.5">{cert.description}</div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2
                              w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================
   CATEGORY DETAIL MODAL
   ============================================ */

function CategoryDetail({ category, product, batch, displayData, isTraced, onClose, trackDetailView }) {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

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
      content = <SagaDetail product={product} displayData={displayData} isTraced={isTraced} />;
      break;
    case 'sotspor':
      title = '🌍 Footprint';
      content = <SotsporDetail product={product} displayData={displayData} isTraced={isTraced} batch={batch} />;
      break;
    case 'naeringarefni':
      title = '🥗 Nutrition';
      content = <NaeringarefniDetail naeringarefni={product.naeringarefni} product={product} />;
      break;
    case 'safety':
      title = '🛡️ Safety';
      content = <SafetyDetail safety={safetyData} />;
      break;
    case 'extra':
      title = 'ℹ️ More Info';
      content = (
        <ExtraDetail
          extra={product.extra}
          productId={product.id}
          batch={batch}
          isTraced={isTraced}
          onRecipeClick={() => trackDetailView('recipe')}
        />
      );
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
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl animate-slide-up"
        style={{ maxHeight: '85vh' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

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

        <div className="overflow-y-auto px-4 pt-4 pb-8" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {content}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   SAGA DETAIL - Batch-only data when traced
   ============================================ */

function SagaDetail({ product, displayData, isTraced }) {
  // For batches: only show batch data (no fallback to product)
  // For products: show product saga data

  if (isTraced) {
    return (
      <div className="space-y-6">
        {/* Traced badge */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="text-sm text-green-800 font-medium">
            Verified traceability data from producer
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="Catch Area" value={displayData.catchArea} />
          <InfoBox label="Method" value={displayData.catchMethod} />
          <InfoBox label="Vessel" value={displayData.vessel} />
          <InfoBox label="Landed" value={displayData.landingPort} />
          <InfoBox label="Landing Date" value={displayData.catchDate} />
          <InfoBox label="Processor" value={displayData.processingFacility} />
          {displayData.processingDate && (
            <InfoBox label="Processed Date" value={displayData.processingDate} />
          )}
        </div>

        {/* Simple journey for batches */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Journey</h3>
          <div className="space-y-0">
            {/* Caught */}
            <JourneyStep
              icon="🎣"
              title="Caught"
              detail={[
                displayData.vessel && `Vessel: ${displayData.vessel}`,
                displayData.catchMethod,
                displayData.catchArea && `Area: ${displayData.catchArea}`,
              ].filter(Boolean).join(' · ') || 'Details not provided'}
              isLast={false}
            />
            
            {/* Landed */}
            <JourneyStep
              icon="⚓"
              title="Landed"
              detail={[
                displayData.landingPort,
                displayData.catchDate,
              ].filter(Boolean).join(' · ') || 'Details not provided'}
              isLast={false}
            />
            
            {/* Processed */}
            <JourneyStep
              icon="🏭"
              title="Processed"
              detail={[
                displayData.processingFacility,
                displayData.processingDate,
              ].filter(Boolean).join(' · ') || 'Details not provided'}
              isLast={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // Non-traced: show product saga (original behavior)
  const saga = product.saga;
  
  if (!saga) {
    return <p className="text-gray-500">No product story available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <InfoBox label="Catch Area" value={saga.catch_area} />
        <InfoBox label="Method" value={saga.catch_method} />
        <InfoBox label="Vessel" value={saga.vessel_name} />
        <InfoBox label="Landed" value={saga.landing_port} />
      </div>

      {saga.supply_chain && saga.supply_chain.length > 0 && (
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
                  <p className="text-xs text-gray-400">
                    {step.date} · {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {saga.processing_method && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-1">Processing</h3>
          <p className="text-sm text-blue-800">{saga.processing_method}</p>
          {saga.processing_facility && (
            <p className="text-xs text-blue-600 mt-1">{saga.processing_facility}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================
   SOTSPOR DETAIL - Batch-only carbon when traced
   ============================================ */

function SotsporDetail({ product, displayData, isTraced, batch }) {
  // For batches: only show batch carbon data
  // For products: show product sotspor data

  if (isTraced) {
    if (!displayData.carbonPerKg) {
      return (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <span className="text-2xl">📊</span>
            <p className="text-yellow-800 font-medium mt-2">Carbon data not available</p>
            <p className="text-yellow-600 text-sm mt-1">
              The producer has not yet calculated the carbon footprint for this batch.
            </p>
          </div>
        </div>
      );
    }

    // Calculate percentages for stage breakdown
    const stageTotal = displayData.stages
      ? (displayData.stages.fishing || 0) +
        (displayData.stages.processing || 0) +
        (displayData.stages.distribution || 0)
      : 0;

    const fishingPct = stageTotal > 0 ? Math.round((displayData.stages?.fishing || 0) / stageTotal * 100) : 0;
    const processingPct = stageTotal > 0 ? Math.round((displayData.stages?.processing || 0) / stageTotal * 100) : 0;
    const distributionPct = stageTotal > 0 ? Math.round((displayData.stages?.distribution || 0) / stageTotal * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Traced badge */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="text-sm text-green-800 font-medium">
            Verified carbon footprint for batch {batch?.id}
          </span>
        </div>

        {/* Main carbon value */}
        <div className="text-center bg-green-50 rounded-xl p-5">
          <div className="text-4xl font-bold text-green-700">
            {displayData.carbonPerKg.toFixed(2)}
          </div>
          <div className="text-sm text-green-600 mt-1">kg CO₂e per kg of product</div>
          <div className="text-xs text-green-500 mt-2">Based on actual batch data</div>
        </div>

        {/* Stage breakdown with percentages */}
        {displayData.stages && stageTotal > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Emissions by Stage</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-sky-50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🚢</div>
                <div className="text-2xl font-bold text-sky-700">{fishingPct}%</div>
                <div className="text-xs text-sky-600 mt-1">Fishing</div>
              </div>
              <div className="bg-violet-50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🏭</div>
                <div className="text-2xl font-bold text-violet-700">{processingPct}%</div>
                <div className="text-xs text-violet-600 mt-1">Processing</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🚚</div>
                <div className="text-2xl font-bold text-amber-700">{distributionPct}%</div>
                <div className="text-xs text-amber-600 mt-1">Distribution</div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison with other proteins */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Comparison</h3>
          <div className="space-y-3">
            <ComparisonRow
              label="This batch (verified)"
              value={displayData.carbonPerKg}
              max={27}
              color="bg-green-500"
            />
            <ComparisonRow
              label="Avg. whitefish"
              value={2.5}
              max={27}
              color="bg-blue-400"
            />
            <ComparisonRow
              label="Chicken (avg)"
              value={6.9}
              max={27}
              color="bg-yellow-400"
            />
            <ComparisonRow
              label="Beef (avg)"
              value={27}
              max={27}
              color="bg-red-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Comparison values are global averages (Our World in Data)
          </p>
        </div>
      </div>
    );
  }

  // Non-traced: show product sotspor (original behavior)
  const sotspor = product.sotspor;

  if (!sotspor) {
    return <p className="text-gray-500">No footprint data available.</p>;
  }

  const comparison = sotspor.comparison || {};

  const comparisonItems = [
    {
      label: 'This product',
      value: sotspor.carbon_kg_co2_per_kg,
      color: 'bg-green-500',
    },
  ];

  if (comparison.category_avg_whitefish_carbon) {
    comparisonItems.push({
      label: 'Avg. whitefish',
      value: comparison.category_avg_whitefish_carbon,
      color: 'bg-blue-400',
    });
  }
  if (comparison.category_avg_farmed_salmon_carbon) {
    comparisonItems.push({
      label: 'Avg. farmed salmon',
      value: comparison.category_avg_farmed_salmon_carbon,
      color: 'bg-blue-400',
    });
  }
  if (comparison.chicken_carbon) {
    comparisonItems.push({
      label: 'Chicken (avg)',
      value: comparison.chicken_carbon,
      color: 'bg-yellow-400',
    });
  }
  if (comparison.beef_carbon) {
    comparisonItems.push({
      label: 'Beef (avg)',
      value: comparison.beef_carbon,
      color: 'bg-red-400',
    });
  }

  const maxCarbon = Math.max(...comparisonItems.map((item) => item.value));

  return (
    <div className="space-y-6">
      <div className="text-center bg-green-50 rounded-xl p-5">
        <div className="text-4xl font-bold text-green-700">{sotspor.carbon_kg_co2_per_kg}</div>
        <div className="text-sm text-green-600 mt-1">kg CO₂ per kg of product</div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Carbon footprint comparison</h3>
        <div className="space-y-3">
          {comparisonItems.map((item) => (
            <ComparisonRow
              key={item.label}
              label={item.label}
              value={item.value}
              max={maxCarbon}
              color={item.color}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Chicken & beef are global averages (Our World in Data)
        </p>
      </div>

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
          <InfoBox
            label="Packaging"
            value={sotspor.packaging_recyclable ? '♻️ Recyclable' : 'Not recyclable'}
          />
        </div>
      </div>

      {sotspor.notes && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">{sotspor.notes}</p>
        </div>
      )}
    </div>
  );
}

/* ============================================
   NUTRITION DETAIL - Always from products.json
   ============================================ */

function NaeringarefniDetail({ naeringarefni, product }) {
  const n = naeringarefni.per_100g;
  const v = naeringarefni.vitamins_minerals;

  const commonName = product?.species?.common_name || '';
  const scientificName = product?.species?.scientific_name || '';
  const hasAllergens = product?.extra?.allergens?.length > 0;

  return (
    <div className="space-y-6">
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

      <div className="pb-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-1">Ingredients</h3>
        <p className="text-gray-700">
          {hasAllergens ? <strong className="font-bold">{commonName}</strong> : commonName}
          {scientificName && <span> ({scientificName})</span>}
        </p>
        {hasAllergens && (
          <p className="text-xs text-gray-500 mt-1">*Allergens are highlighted in bold</p>
        )}
      </div>

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

/* ============================================
   SAFETY DETAIL - Always from safety.json
   ============================================ */

function SafetyDetail({ safety }) {
  if (!safety) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">🔬 Microbiological Criteria</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-2 text-gray-500 font-medium text-xs">Parameter</th>
                <th className="text-right py-2 px-2 text-green-600 font-medium text-xs">Acceptable</th>
                <th className="text-right py-2 pl-2 text-red-500 font-medium text-xs">Max tolerance</th>
              </tr>
            </thead>
            <tbody>
              {safety.microbiological_criteria.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2.5 pr-2 text-gray-800 font-medium text-xs leading-tight">
                    {item.parameter}
                  </td>
                  <td className="py-2.5 px-2 text-right text-xs whitespace-nowrap">
                    <span className="text-green-700 font-semibold">{item.acceptable_limit}</span>
                    {item.unit && <span className="text-gray-400 font-normal ml-1">{item.unit}</span>}
                  </td>
                  <td className="py-2.5 pl-2 text-right text-xs whitespace-nowrap">
                    <span className="text-red-600 font-semibold">{item.max_tolerance}</span>
                    {item.unit && <span className="text-gray-400 font-normal ml-1">{item.unit}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">⚗️ Chemical Criteria</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-2 text-gray-500 font-medium text-xs">Parameter</th>
                <th className="text-right py-2 px-2 text-green-600 font-medium text-xs">Acceptable</th>
                <th className="text-right py-2 pl-2 text-red-500 font-medium text-xs">Max tolerance</th>
              </tr>
            </thead>
            <tbody>
              {safety.chemical_criteria.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2.5 pr-2 text-gray-800 font-medium text-xs leading-tight">
                    {item.parameter}
                  </td>
                  <td className="py-2.5 px-2 text-right text-xs whitespace-nowrap">
                    <span className="text-green-700 font-semibold">{item.acceptable_limit}</span>
                    {item.unit && <span className="text-gray-400 font-normal ml-1">{item.unit}</span>}
                  </td>
                  <td className="py-2.5 pl-2 text-right text-xs whitespace-nowrap">
                    <span className="text-red-600 font-semibold">{item.max_tolerance}</span>
                    {item.unit && <span className="text-gray-400 font-normal ml-1">{item.unit}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-xs text-blue-800 font-medium leading-relaxed">
          📋 {safety.testing_note}
        </p>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed">
        {safety.regulatory_basis}
      </p>
    </div>
  );
}

/* ============================================
   EXTRA DETAIL - Static from products.json + batch ID
   ============================================ */

function ExtraDetail({ extra, productId, batch, isTraced, onRecipeClick }) {
  return (
    <div className="space-y-6">
      {/* Batch info if traced */}
      {isTraced && batch && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-semibold text-green-800 mb-2">📦 Batch Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">Batch ID</span>
              <span className="font-mono text-green-800">{batch.id}</span>
            </div>
            {batch.landing_date && (
              <div className="flex justify-between">
                <span className="text-green-600">Landing Date</span>
                <span className="text-green-800">{batch.landing_date}</span>
              </div>
            )}
            {batch.processing_date && (
              <div className="flex justify-between">
                <span className="text-green-600">Processing Date</span>
                <span className="text-green-800">{batch.processing_date}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <InfoBox label="Storage" value={extra.storage_instructions} />
        <InfoBox label="Shelf Life" value={`${extra.shelf_life_days} days`} />
        <InfoBox label="Best Before" value={extra.best_before} />
        {!isTraced && <InfoBox label="Batch" value={extra.batch_id} />}
        <InfoBox label="Barcode" value={extra.barcode} />
        <InfoBox label="Allergens" value={extra.allergens.join(', ') || 'None'} />
      </div>

      {extra.recipes && extra.recipes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Recipes</h3>
          <div className="space-y-2">
            {extra.recipes.map((recipe, index) => (
              <Link
                to={`/product/${productId}/recipe/${index}`}
                key={recipe.name}
                onClick={() => onRecipeClick && onRecipeClick()}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <span className="text-2xl">👨‍🍳</span>
                <span className="text-sm font-medium text-orange-900 flex-1">{recipe.name}</span>
                <span className="text-orange-400 text-lg">›</span>
              </Link>
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
      <div className="text-sm font-medium text-gray-900 mt-0.5">{value || '—'}</div>
    </div>
  );
}

function JourneyStep({ icon, title, detail, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
          {icon}
        </div>
        {!isLast && <div className="w-0.5 bg-blue-200 flex-1 min-h-[24px]" />}
      </div>
      <div className="pb-4">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{detail}</p>
      </div>
    </div>
  );
}

function ComparisonRow({ label, value, max, color }) {
  const width = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">
          {typeof value === 'number' ? value.toFixed(2) : value} kg CO₂
        </span>
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
      <span className={`text-sm ${indent ? 'text-gray-500 pl-3' : 'text-gray-700'}`}>{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}