"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (dragHandle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 1 : undefined,
  };

  const dragHandle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 touch-none p-1 shrink-0"
      aria-label="Drag to reorder"
    >
      <GripVertical size={16} />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style}>
      {children(dragHandle)}
    </div>
  );
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (reordered: T[]) => void;
  renderItem: (item: T, dragHandle: ReactNode) => ReactNode;
}) {
  const [ordered, setOrdered] = useState<T[]>(items);
  const isDraggingRef = useRef(false);

  // Sync when parent updates items (e.g. optimistic image updates) — skip during active drag.
  useEffect(() => {
    if (!isDraggingRef.current) setOrdered(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    isDraggingRef.current = false;
    if (over && active.id !== over.id) {
      setOrdered((prev) => {
        const oldIdx = prev.findIndex((i) => i.id === active.id);
        const newIdx = prev.findIndex((i) => i.id === over.id);
        const next = arrayMove(prev, oldIdx, newIdx);
        onReorder(next);
        return next;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => { isDraggingRef.current = true; }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { isDraggingRef.current = false; }}
    >
      <SortableContext
        items={ordered.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {ordered.map((item) => (
          <SortableRow key={item.id} id={item.id}>
            {(handle) => renderItem(item, handle)}
          </SortableRow>
        ))}
      </SortableContext>
    </DndContext>
  );
}
