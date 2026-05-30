# UniTeia-v2 → Hermes Integration Map
# PLANO-069 §6: 7 integration points

## 1. Content Pipeline (🔴 HIGH)
| Aspect | Hermes Side | UniTeia Side |
|--------|-------------|--------------|
| Current | daily_ops.py → lermf blog | manual import via mega-factory |
| Target | `daily_ops.py --output=uniteia` → JSON API contract | consume via import endpoint |
| Schema | Content Package Contract v1 | entity-graph.json + content-registry |
| Mutation | Add --output=uniteia flag to daily_ops.py | Add import:package API endpoint |

## 2. Image Pipeline (🟡 MED)
| Aspect | Hermes Side | UniTeia Side |
|--------|-------------|--------------|
| Current | nim_flux_gen.py → 4 presets, $0.00 | manual asset staging |
| Target | `nim_flux_gen.py --format=uniteia-assets` | DepthCard material auto-optimization |
| Mutation | Add format flag to nim_flux_gen.py | Add asset auto-ingestion |

## 3. Design Tokens (🟡 MED)
| Aspect | Hermes Side | UniTeia Side |
|--------|-------------|--------------|
| Current | electroplix theme (custom) | SolarLanso 50+ CSS props |
| Target | Shared token system | Shared base + platform overrides |
| Mutation | Extract @hermes/uniteia-tokens package | Adopt shared tokens |

## 4. i18n (🟡 MED)
| Aspect | Hermes Side | UniTeia Side |
|--------|-------------|--------------|
| Current | 9 langs (PT EN ES FR DE IT JA ZH RU) | 8 langs (same −RU) |
| Target | 8−9 unified | hreflang coordination |
| Mutation | Drop RU or add to UniTeia | Shared translation memory |

## 5. Deploy (🟢 LOW)
| Aspect | Hermes Side | UniTeia Side |
|--------|-------------|--------------|
| Current | CF Pages, separate | CF Pages, separate |
| Target | Shared CI workflow | Shared CI workflow |
| Mutation | .github/workflows/deploy-*.yml | .github/workflows/deploy-*.yml |

## 6. Skills (🟢 LOW)
| Aspect | Hermes Side | UniTeia Side |
|--------|-------------|--------------|
| Current | 130+ skills | 2 skills (uniteia + uniteia-design) |
| Target | Unified registration | Unified registration |
| Mutation | Migrate to ~/.hermes/skills/uniteia/ | Update paths |

## 7. Analytics (🟢 LOW)
| Aspect | Hermes Side | UniTeia Side |
|--------|-------------|--------------|
| Current | metrics.py (GEO FAQ Schema) | None |
| Target | metrics.py --source=uniteia | Unified dashboard |
| Mutation | Add --source flag to metrics.py | Add tracking |

## Priority

```
Phase 1 (now) → M1 content · M2 images · M3 tokens
Phase 2 (next) → M4 i18n · M5 quality gates · M6 analytics
Phase 3 (later) → M7 CI · M8 skills · M9 unified dash
```

References: PLANO-069, Hermes v4.1, UniTeia-v2 README
