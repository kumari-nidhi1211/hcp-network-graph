import React, { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import type { Attributes } from 'graphology-types';

import { HCPDetail } from './HCPDetail';
import { SearchBar } from './SearchBar';

interface NodeAttributes extends Attributes {
  id: string;
  label: string;
  labels: string;
  education?: string;
  experience?: string;
  publications?: string[];
  color?: string;
  originalColor?: string;
}

interface EdgeAttributes extends Attributes {
  source: string;
  target: string;
  labels: string;
  color?: string;
  size?: number;
}

export default function HCPNetworkGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const sigmaRef = useRef<Sigma<NodeAttributes, EdgeAttributes> | null>(null);

  const [graph, setGraph] = useState<Graph<NodeAttributes, EdgeAttributes> | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeAttributes | null>(null);

  useEffect(() => {
    fetch('/hcp_network_graph_data.json')
      .then((res) => res.json())
      .then((data: { nodes: NodeAttributes[]; edges: EdgeAttributes[] }) => {
        const g = new Graph<NodeAttributes, EdgeAttributes>();

        data.nodes.forEach((node) => {
					const color = node.labels === 'Researcher' ? '#1f77b4' : '#ff7f0e';
					const x = Math.random() * 100 - 50;
					const y = Math.random() * 100 - 50;

					g.addNode(node.id, {
						...node,
						x,
						y,
						size: 10,
						color,
						originalColor: color
					});
				});


        data.edges.forEach((edge) => {
          g.addEdge(edge.source, edge.target, {
            ...edge,
            size: 1,
            color: '#ccc',
          });
        });

        setGraph(g);

        if (containerRef.current) {
          const renderer = new Sigma(g, containerRef.current, {
            allowInvalidContainer: true,
          });
          sigmaRef.current = renderer;

          renderer.on('clickNode', ({ node }) => {
            setSelectedNode(g.getNodeAttributes(node));
          });

          renderer.on('clickStage', () => {
            setSelectedNode(null);
          });

          renderer.on('enterEdge', ({ edge, event }) => {
            const edgeAttrs = g.getEdgeAttributes(edge);
            const sourceLabel = g.getNodeAttribute(edgeAttrs.source, 'label');
            const targetLabel = g.getNodeAttribute(edgeAttrs.target, 'label');

            const tooltip = tooltipRef.current;
            if (tooltip) {
              tooltip.innerHTML = `<strong>${sourceLabel}</strong> ↔ <strong>${targetLabel}</strong><br/>${edgeAttrs.labels}`;
              tooltip.style.display = 'block';
              tooltip.style.left = `${event.x + 10}px`;
              tooltip.style.top = `${event.y + 10}px`;
              tooltip.style.opacity = '1';
            }
          });

          renderer.on('leaveEdge', () => {
            const tooltip = tooltipRef.current;
            if (tooltip) {
              tooltip.style.display = 'none';
              tooltip.style.opacity = '0';
            }
          });

          renderer.on('clickEdge', ({ edge }) => {
            const edgeAttrs = g.getEdgeAttributes(edge);
            const sourceLabel = g.getNodeAttribute(edgeAttrs.source, 'label');
            const targetLabel = g.getNodeAttribute(edgeAttrs.target, 'label');

            alert(`Connection between ${sourceLabel} and ${targetLabel}:\n${edgeAttrs.labels}`);
          });
        }
      });
  }, []);

  const onSearch = (query: string) => {
    if (!graph || !sigmaRef.current) return;

    const foundNodeId = graph.findNode((_, attrs) => 
      attrs.label?.toLowerCase().includes(query.toLowerCase())
		);

    if (foundNodeId) {
      const foundNodeAttrs = graph.getNodeAttributes(foundNodeId);
      setSelectedNode(foundNodeAttrs);

      const neighbors = graph.neighbors(foundNodeId);

      graph.updateEachNodeAttributes((nodeId, attrs) => ({
        ...attrs,
        color:
          nodeId === foundNodeId
            ? '#2ca02c'
            : neighbors.includes(nodeId)
            ? '#98df8a'
            : attrs.originalColor,
      }));

      graph.updateEachEdgeAttributes((edgeId, attrs) => {
        const { source, target } = graph.getEdgeAttributes(edgeId);
        const isConnected = source === foundNodeId || target === foundNodeId;
        return {
          ...attrs,
          color: isConnected ? '#2ca02c' : '#ccc',
          size: isConnected ? 2 : 1,
        };
      });

      const displayData = sigmaRef.current.getNodeDisplayData(foundNodeId);
      if (displayData) {
        sigmaRef.current.getCamera().animate(
          {
            x: displayData.x,
            y: displayData.y,
            ratio: 0.5,
          },
          { duration: 600 }
        );
      }
    } else {
      alert(`HCP "${query}" not found.`);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <SearchBar onSearch={onSearch} />
      <div className="flex flex-1 gap-4 mt-4">
        <div className="flex-1 bg-white rounded-xl shadow p-4 relative">
          <div
            ref={containerRef}
            className="absolute top-0 left-0 right-0 bottom-0 rounded-xl"
          />
          <div
            ref={tooltipRef}
            className="absolute z-50 bg-white border border-gray-300 text-sm shadow-md p-2 rounded-md pointer-events-none transition-opacity duration-150"
            style={{ display: 'none' }}
          />
        </div>
        <div className="w-1/3 bg-white rounded-xl shadow p-4 overflow-y-auto">
          <HCPDetail selectedNode={selectedNode} />
        </div>
      </div>
    </div>
  );
}
