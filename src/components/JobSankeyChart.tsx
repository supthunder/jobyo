import { useEffect, useRef } from 'react';
import { select } from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNode } from 'd3-sankey';
import type { JobApplication } from '@/lib/types';

interface SankeyNodeExtra {
  name: string;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLinkExtra {
  source: number | any;
  target: number | any;
  value: number;
  width?: number;
}

interface JobSankeyChartProps {
  jobs: JobApplication[];
}

export function JobSankeyChart({ jobs }: JobSankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || jobs.length === 0) return;

    // Clear previous chart
    select(svgRef.current).selectAll('*').remove();

    // Prepare data for Sankey diagram
    const statusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sankeyNodes = [
      { name: 'APPLIED' },
      { name: 'ONLINE_TEST' },
      { name: 'RECORDED_INTERVIEW' },
      { name: 'FIRST_INTERVIEW' },
      { name: 'SECOND_INTERVIEW' },
      { name: 'ASSESSMENT_CENTER' },
      { name: 'REJECTED' },
      { name: 'WITHDRAWN' },
    ];

    const sankeyLinks: SankeyLinkExtra[] = [];

    // Create links between consecutive stages
    for (let i = 0; i < sankeyNodes.length - 3; i++) {
      const source = sankeyNodes[i].name;
      const target = sankeyNodes[i + 1].name;
      const value = statusCounts[source] || 0;
      if (value > 0) {
        sankeyLinks.push({ source: i, target: i + 1, value });
      }
    }

    // Add links to REJECTED and WITHDRAWN
    const rejectedIndex = sankeyNodes.findIndex(n => n.name === 'REJECTED');
    const withdrawnIndex = sankeyNodes.findIndex(n => n.name === 'WITHDRAWN');
    
    sankeyNodes.forEach((node, i) => {
      if (node.name !== 'REJECTED' && node.name !== 'WITHDRAWN') {
        const rejectedCount = jobs.filter(j => j.status === 'REJECTED' && statusCounts[node.name]).length;
        const withdrawnCount = jobs.filter(j => j.status === 'WITHDRAWN' && statusCounts[node.name]).length;
        
        if (rejectedCount > 0) {
          sankeyLinks.push({ source: i, target: rejectedIndex, value: rejectedCount });
        }
        if (withdrawnCount > 0) {
          sankeyLinks.push({ source: i, target: withdrawnIndex, value: withdrawnCount });
        }
      }
    });

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const sankeyGenerator = sankey<SankeyNodeExtra, SankeyLinkExtra>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    const { nodes, links } = sankeyGenerator({
      nodes: sankeyNodes.map(d => ({ ...d })),
      links: sankeyLinks,
    });

    const svg = select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add glow filter for nodes
    const defs = svg.append('defs');
    const blueGlow = defs.append('filter')
      .attr('id', 'blue-glow')
      .attr('x', '-40%')
      .attr('y', '-40%')
      .attr('width', '180%')
      .attr('height', '180%');
      
    blueGlow.append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'blur');
      
    blueGlow.append('feFlood')
      .attr('flood-color', '#0466c8')
      .attr('flood-opacity', 0.3)
      .attr('result', 'color');
      
    blueGlow.append('feComposite')
      .attr('in', 'color')
      .attr('in2', 'blur')
      .attr('operator', 'in')
      .attr('result', 'glow');
      
    const feMerge = blueGlow.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'glow');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Create a filter for the red nodes
    const redGlow = defs.append('filter')
      .attr('id', 'red-glow')
      .attr('x', '-40%')
      .attr('y', '-40%')
      .attr('width', '180%')
      .attr('height', '180%');
      
    redGlow.append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'blur');
      
    redGlow.append('feFlood')
      .attr('flood-color', '#d62828')
      .attr('flood-opacity', 0.3)
      .attr('result', 'color');
      
    redGlow.append('feComposite')
      .attr('in', 'color')
      .attr('in2', 'blur')
      .attr('operator', 'in')
      .attr('result', 'glow');
      
    const redMerge = redGlow.append('feMerge');
    redMerge.append('feMergeNode')
      .attr('in', 'glow');
    redMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Create a filter for the orange (withdrawn) nodes
    const orangeGlow = defs.append('filter')
      .attr('id', 'orange-glow')
      .attr('x', '-40%')
      .attr('y', '-40%')
      .attr('width', '180%')
      .attr('height', '180%');
      
    orangeGlow.append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'blur');
      
    orangeGlow.append('feFlood')
      .attr('flood-color', '#e85d04')
      .attr('flood-opacity', 0.3)
      .attr('result', 'color');
      
    orangeGlow.append('feComposite')
      .attr('in', 'color')
      .attr('in2', 'blur')
      .attr('operator', 'in')
      .attr('result', 'glow');
      
    const orangeMerge = orangeGlow.append('feMerge');
    orangeMerge.append('feMergeNode')
      .attr('in', 'glow');
    orangeMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Add links
    svg.append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', (d: SankeyLinkExtra) => Math.max(1, d.width || 0))
      .attr('stroke', (d: SankeyLinkExtra) => {
        if (d.target.name === 'REJECTED') return '#d62828';
        if (d.target.name === 'WITHDRAWN') return '#e85d04';
        return '#0466c8';
      })
      .attr('fill', 'none')
      .attr('opacity', 0.3);

    // Add nodes
    const nodeElements = svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .enter()
      .append('rect')
      .attr('x', (d: SankeyNodeExtra) => d.x0 || 0)
      .attr('y', (d: SankeyNodeExtra) => d.y0 || 0)
      .attr('height', (d: SankeyNodeExtra) => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', (d: SankeyNodeExtra) => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', (d: SankeyNodeExtra) => {
        if (d.name === 'REJECTED') return '#d62828';
        if (d.name === 'WITHDRAWN') return '#e85d04';
        return '#0466c8';
      })
      .attr('filter', (d: SankeyNodeExtra) => {
        if (d.name === 'REJECTED') return 'url(#red-glow)';
        if (d.name === 'WITHDRAWN') return 'url(#orange-glow)';
        return 'url(#blue-glow)';
      });

    // Add node labels with white text and better positioning
    svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', (d: SankeyNodeExtra) => {
        // Position the text in the middle of the node for better readability
        if (d.name === 'REJECTED' || d.name === 'WITHDRAWN') {
          return (d.x0 || 0) + ((d.x1 || 0) - (d.x0 || 0)) / 2;
        }
        return (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6;
      })
      .attr('y', (d: SankeyNodeExtra) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: SankeyNodeExtra) => {
        // Center text for rejected and withdrawn nodes
        if (d.name === 'REJECTED' || d.name === 'WITHDRAWN') {
          return 'middle';
        }
        return (d.x0 || 0) < width / 2 ? 'start' : 'end';
      })
      .text((d: SankeyNodeExtra) => `${d.name.replace(/_/g, ' ')} (${statusCounts[d.name] || 0})`)
      .style('font-size', '10px')
      .style('fill', 'white')
      .style('font-weight', '500');

    // Add value labels on links
    svg.append('g')
      .selectAll('text')
      .data(links.filter(l => l.value > 1))
      .enter()
      .append('text')
      .attr('x', (d: any) => (d.source.x1 + d.target.x0) / 2)
      .attr('y', (d: any) => (d.y0 + d.y1) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d: SankeyLinkExtra) => d.value)
      .style('font-size', '10px')
      .style('fill', 'white')
      .style('font-weight', '500')
      .style('pointer-events', 'none');
      
  }, [jobs]);

  return (
    <div className="w-full overflow-hidden rounded-xl p-4" style={{ background: 'rgba(3, 7, 18, 0.7)' }}>
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="mx-auto" />
      </div>
    </div>
  );
} 