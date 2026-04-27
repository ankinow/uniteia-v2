export function evaluateLighthouseGate(
	report: LighthouseReportLike,
	options: EvaluateLighthouseGateOptions = {}
): LighthouseGateReport {
	const categoryThresholds: Record<LighthouseCategoryKey, number> = {
		performance: options.categoryThresholds?.performance ?? DEFAULT_CATEGORY_THRESHOLDS.performance,
		accessibility: options.categoryThresholds?.accessibility ?? DEFAULT_CATEGORY_THRESHOLDS.accessibility,
		'best-practices': options.categoryThresholds?.bestPractices ?? DEFAULT_CATEGORY_THRESHOLDS['best-practices'],
		seo: options.categoryThresholds?.seo ?? DEFAULT_CATEGORY_THRESHOLDS.seo,
	}

	const auditedUrl = normalizeAuditedUrl(options.auditedUrl ?? report.finalDisplayedUrl)
	const launchPhase = options.launchPhase ?? 'report-validation'

	const issues: LighthouseGateIssue[] = []
	const categoryScores = Object.fromEntries(
		REQUIRED_LIGHTHOUSE_CATEGORIES.map(category => [
			category,
			readLighthouseCategoryScore(report, category),
		])
	) as Record<LighthouseCategoryKey, number | null>

	for (const category of REQUIRED_LIGHTHOUSE_CATEGORIES) {
		const scorePercent = categoryScores[category]
		const threshold = categoryThresholds[category]

		if (scorePercent === null) {
			issues.push({
				kind: 'invalid-report-data',
				message: `Lighthouse report is missing a valid score for ${category}`,
				category,
				launchPhase,
			})
			continue
		}

		if (scorePercent < threshold) {
			issues.push({
				kind: 'category-below-threshold',
				message: `${category} is below the ${threshold}% threshold at ${scorePercent.toFixed(1)}%`,
				category,
				scorePercent,
				thresholdPercent: threshold,
				launchPhase,
			})
		}
	}

	if (!isRecord(report.categories)) {
		issues.push({
			kind: 'invalid-report-data',
			message: 'Lighthouse report categories payload is missing or invalid',
			launchPhase,
		})
	}

	return {
		ok: issues.length === 0,
		auditedUrl,
		finalDisplayedUrl: report.finalDisplayedUrl ?? null,
		categoryThresholds,
		launchPhase,
		categoryScores,
		issues,
	}
}
