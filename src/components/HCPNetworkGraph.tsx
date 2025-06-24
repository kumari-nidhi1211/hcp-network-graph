import { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import type { Attributes } from 'graphology-types';
import { GraphView } from './GraphView';
import { HCPDetail } from './HCPDetail';
import { SearchBar } from './SearchBar';

interface NodeAttributes extends Attributes {
  id: string;
  labels: string;
  label: string;
  education?: string;
  experience?: string;
  publications?: string[];
}

interface EdgeAttributes extends Attributes {
  source: string;
  target: string;
  labels: string;
}

export default function HCPNetworkGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [graph, setGraph] = useState<Graph<NodeAttributes, EdgeAttributes> | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeAttributes | null>(null);
  const sigmaRef = useRef<Sigma<NodeAttributes, EdgeAttributes, Attributes> | null>(null);

  useEffect(() => {
    fetch('/hcp_network_graph_data.json')
      .then((res) => res.json())
      .then((data: { nodes: NodeAttributes[]; edges: EdgeAttributes[] }) => {
        const g = new Graph<NodeAttributes, EdgeAttributes>();

        data.nodes.forEach((node) => {
          const color = node.labels === 'Researcher' ? '#1f77b4' : '#ff7f0e';
          g.addNode(node.id, {
            ...node,
            label: node.label,
            size: 10,
            color,
            originalColor: color
          });
        });

        data.edges.forEach((edge) => {
          g.addEdge(edge.source, edge.target, {
              label: edge.labels,
              size: 1,
              color: '#ccc',
              source: '',
              target: '',
              labels: ''
          });
        });

        setGraph(g);

        if (containerRef.current) {
          const renderer = new Sigma(g, containerRef.current);
          sigmaRef.current = renderer;

          renderer.on('clickNode', ({ node }) => {
            setSelectedNode(g.getNodeAttributes(node) as NodeAttributes);
          });

          renderer.on('clickStage', () => {
            setSelectedNode(null);
          });
        }
      });
  }, []);

  const onSearch = (query: string) => {
    if (!graph) return;

    const foundNodeId = graph.findNode((_, attrs) =>
      attrs.label?.toLowerCase().includes(query.toLowerCase())
    );

    if (foundNodeId) {
      setSelectedNode(graph.getNodeAttributes(foundNodeId));

      graph.updateEachNodeAttributes((nodeId, attrs) => ({
        ...attrs,
        color: nodeId === foundNodeId ? '#2ca02c' : attrs.originalColor,
      }));
    } else {
      alert(`HCP "${query}" not found`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SearchBar onSearch={onSearch} />
      <div className="flex flex-1 gap-4 mt-4">
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <GraphView containerRef={containerRef} />
        </div>
        <div className="w-1/3 bg-white rounded-xl shadow p-4 overflow-y-auto">
          <HCPDetail selectedNode={selectedNode} />
        </div>
      </div>
    </div>
  );
}
