from typing import Dict, Any

class ReportGenerator:
    @staticmethod
    def generate_report(parsed_data: Dict[str, Any], ats_results: Dict[str, Any], match_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combines the parsed resume details, ATS scores, and Job Match analysis into a single consolidated report.
        """
        return {
            "summary": {
                "candidate_name": parsed_data.get("name", "Unknown Candidate"),
                "email": parsed_data.get("email", ""),
                "phone": parsed_data.get("phone", ""),
                "skills_count": len(parsed_data.get("skills", [])),
                "word_count": ats_results.get("word_count", 0),
            },
            "ats_metrics": {
                "score": ats_results.get("ats_score", 0),
                "formatting_score": ats_results.get("score_breakdown", {}).get("formatting", 0),
                "contact_score": ats_results.get("score_breakdown", {}).get("contact_info", 0),
                "skills_score": ats_results.get("score_breakdown", {}).get("skills", 0),
                "metrics_score": ats_results.get("score_breakdown", {}).get("metrics", 0),
                "suggestions": ats_results.get("suggestions", [])
            },
            "job_match": {
                "match_score": match_results.get("match_score", 0),
                "matching_skills": match_results.get("matching_skills", []),
                "missing_skills": match_results.get("missing_skills", []),
                "gap_analysis": match_results.get("gap_analysis", [])
            }
        }
