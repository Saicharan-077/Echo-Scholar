"""
EchoXScholar - Concept Dependency Graph Service
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.learning_dna import ConceptNode, ConceptDependency


class DependencyGraphService:
    """Service to create, query, and analyze prerequisite concept graphs for subjects."""

    @staticmethod
    async def get_user_subject_graph(
        db: AsyncSession,
        user_id: int,
        subject: str = "Data Structures & Algorithms"
    ) -> Dict[str, Any]:
        # Fetch nodes
        nodes_res = await db.execute(
            select(ConceptNode).where(
                ConceptNode.user_id == user_id,
                ConceptNode.subject == subject
            )
        )
        nodes = list(nodes_res.scalars().all())

        # If empty, initialize default DAG for the subject
        if not nodes:
            nodes = await DependencyGraphService.seed_default_graph(db, user_id, subject)

        node_ids = [n.id for n in nodes]
        
        # Fetch edges
        deps_res = await db.execute(
            select(ConceptDependency).where(
                ConceptDependency.parent_concept_id.in_(node_ids)
            )
        )
        deps = list(deps_res.scalars().all())

        formatted_nodes = [
            {
                "id": n.id,
                "name": n.name,
                "subject": n.subject,
                "description": n.description,
                "mastery_percentage": n.mastery_percentage,
                "status": n.status, # Mastered, In Progress, Needs Revision, Not Started
                "last_reviewed": n.last_reviewed_at.isoformat() if n.last_reviewed_at else None
            }
            for n in nodes
        ]

        formatted_edges = [
            {
                "id": d.id,
                "source": d.parent_concept_id,
                "target": d.child_concept_id,
                "type": d.dependency_type
            }
            for d in deps
        ]

        return {
            "subject": subject,
            "nodes": formatted_nodes,
            "edges": formatted_edges
        }

    @staticmethod
    async def seed_default_graph(
        db: AsyncSession,
        user_id: int,
        subject: str
    ) -> List[ConceptNode]:
        default_concepts = [
            ("Arrays & Strings", "Foundational memory layouts and sequence manipulations", 90.0, "Mastered"),
            ("Recursion", "Self-referential function calls and call stack mechanics", 65.0, "In Progress"),
            ("Linked Lists", "Node pointers and memory chaining", 85.0, "Mastered"),
            ("Trees & Binary Search Trees", "Hierarchical data branching and search balance", 50.0, "Needs Revision"),
            ("Memoization & Top-Down DP", "Caching recursive solutions to avoid redundant compute", 40.0, "In Progress"),
            ("Dynamic Programming", "Optimal substructure and state transition tables", 25.0, "Needs Revision"),
            ("Graphs & Breadth-First Search", "Network connectivity and shortest paths", 60.0, "In Progress"),
        ]

        created_nodes: List[ConceptNode] = []
        for name, desc, mastery, status in default_concepts:
            node = ConceptNode(
                user_id=user_id,
                subject=subject,
                name=name,
                description=desc,
                mastery_percentage=mastery,
                status=status
            )
            db.add(node)
            created_nodes.append(node)

        await db.commit()
        for n in created_nodes:
            await db.refresh(n)

        # Map dependencies (Parent -> Child)
        node_map = {n.name: n.id for n in created_nodes}
        dependencies = [
            ("Arrays & Strings", "Recursion"),
            ("Recursion", "Memoization & Top-Down DP"),
            ("Recursion", "Trees & Binary Search Trees"),
            ("Memoization & Top-Down DP", "Dynamic Programming"),
            ("Trees & Binary Search Trees", "Graphs & Breadth-First Search")
        ]

        for parent_name, child_name in dependencies:
            if parent_name in node_map and child_name in node_map:
                dep = ConceptDependency(
                    parent_concept_id=node_map[parent_name],
                    child_concept_id=node_map[child_name],
                    dependency_type="Prerequisite"
                )
                db.add(dep)

        await db.commit()
        return created_nodes

    @staticmethod
    async def check_prerequisite_gaps(
        db: AsyncSession,
        user_id: int,
        target_concept_name: str
    ) -> List[Dict[str, Any]]:
        """Identifies any prerequisite nodes with mastery < 60%."""
        result = await db.execute(
            select(ConceptNode).where(
                ConceptNode.user_id == user_id,
                ConceptNode.name.ilike(f"%{target_concept_name}%")
            )
        )
        node = result.scalars().first()
        if not node:
            return []

        # Find parents
        deps_res = await db.execute(
            select(ConceptDependency).where(ConceptDependency.child_concept_id == node.id)
        )
        deps = list(deps_res.scalars().all())
        parent_ids = [d.parent_concept_id for d in deps]

        gaps = []
        if parent_ids:
            parents_res = await db.execute(
                select(ConceptNode).where(ConceptNode.id.in_(parent_ids))
            )
            for p in parents_res.scalars().all():
                if p.mastery_percentage < 60.0:
                    gaps.append({
                        "name": p.name,
                        "mastery_percentage": p.mastery_percentage,
                        "recommendation": f"Review {p.name} before advancing to {target_concept_name}."
                    })
        return gaps
